"""
routers/news.py
---------------
Endpoints for market news and financial intelligence.

Routes
------
GET /api/news/{account_id}       — recent news articles (NewsAPI)
GET /api/financial/{account_id}  — financial news + company profile (Finnhub)
GET /api/stockquote/{account_id} — stock quote + price history (yfinance)
"""

import asyncio
from datetime import datetime, timedelta

import httpx
from fastapi import APIRouter, HTTPException, Query

from config import settings
from data import find_account
from mock import mock_financial_news, mock_news, mock_profile
from queries import finnhub_short_name, news_query

router = APIRouter(prefix="/api")


# ── NewsAPI ─────────────────────────────────────────────────────────────────

@router.get("/news/{account_id}")
async def get_news(account_id: str, days_back: int = Query(30, ge=1, le=90)):
    """
    Fetch recent news articles for an account from NewsAPI.
    Falls back to mock data when NEWS_API_KEY is not set.
    """
    account = find_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not settings.NEWS_API_KEY:
        return {"articles": mock_news(account["name"]), "source": "mock"}

    query = news_query(account["name"])
    from_date = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%d")

    params = {
        "q": query,
        "from": from_date,
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": 15,
        "apiKey": settings.NEWS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get("https://newsapi.org/v2/everything", params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"NewsAPI error: {resp.text}")

    raw = resp.json()
    articles = [
        {
            "source": a["source"]["name"],
            "title": a["title"],
            "description": a["description"],
            "url": a["url"],
            "published_at": a["publishedAt"],
            "image_url": a.get("urlToImage"),
        }
        for a in raw.get("articles", [])
        if a.get("title") and "[Removed]" not in a.get("title", "")
    ]

    return {"articles": articles, "source": "newsapi", "query_used": query}


# ── Finnhub ──────────────────────────────────────────────────────────────────

@router.get("/financial/{account_id}")
async def get_financial(account_id: str):
    """
    Fetch financial news and company profile from Finnhub.
    Returns mock data when FINNHUB_API_KEY is not set.
    Returns an informational note for privately-held accounts (no ticker).
    """
    account = find_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not settings.FINNHUB_API_KEY:
        return {
            "news": mock_financial_news(account["name"]),
            "profile": mock_profile(account),
            "source": "mock",
        }

    ticker = account.get("ticker")
    if not ticker:
        return {
            "news": [],
            "profile": None,
            "source": "finnhub",
            "note": "This account is privately held — no ticker symbol available.",
        }

    today = datetime.utcnow()
    from_date = (today - timedelta(days=30)).strftime("%Y-%m-%d")
    to_date = today.strftime("%Y-%m-%d")

    async with httpx.AsyncClient(timeout=15.0) as client:
        news_resp, profile_resp = await asyncio.gather(
            client.get(
                "https://finnhub.io/api/v1/company-news",
                params={"symbol": ticker, "from": from_date, "to": to_date, "token": settings.FINNHUB_API_KEY},
            ),
            client.get(
                "https://finnhub.io/api/v1/stock/profile2",
                params={"symbol": ticker, "token": settings.FINNHUB_API_KEY},
            ),
        )

    news_items = news_resp.json() if news_resp.status_code == 200 else []
    profile = profile_resp.json() if profile_resp.status_code == 200 else {}

    articles = [
        {
            "source": item.get("source", ""),
            "title": item.get("headline", ""),
            "description": item.get("summary", ""),
            "url": item.get("url", ""),
            "published_at": datetime.utcfromtimestamp(item.get("datetime", 0)).isoformat() + "Z",
            "image_url": item.get("image"),
        }
        for item in news_items[:15]
        if item.get("headline")
    ]

    return {"news": articles, "profile": profile, "source": "finnhub"}


# ── yfinance ─────────────────────────────────────────────────────────────────

@router.get("/stockquote/{account_id}")
async def get_stock_quote(account_id: str):
    """
    Fetch stock quote and 90-day price history from yfinance.
    Returns a note for privately-held accounts.
    """
    account = find_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    ticker = account.get("ticker")
    if not ticker:
        return {"quote": None, "note": "Privately held — no stock data available."}

    try:
        import yfinance as yf

        stock = yf.Ticker(ticker)
        info = stock.info

        current = info.get("currentPrice") or info.get("regularMarketPrice")
        prev_close = info.get("previousClose")

        quote = {
            "ticker": ticker,
            "name": info.get("longName", account["name"]),
            "price": current,
            "change_pct": (
                round((current - prev_close) / prev_close * 100, 2)
                if current and prev_close
                else None
            ),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "revenue": info.get("totalRevenue"),
            "sector": info.get("sector"),
            "industry_yf": info.get("industry"),
            "description": info.get("longBusinessSummary", "")[:500],
            "52w_high": info.get("fiftyTwoWeekHigh"),
            "52w_low": info.get("fiftyTwoWeekLow"),
            "analyst_target": info.get("targetMeanPrice"),
            "recommendation": info.get("recommendationKey"),
        }

        hist = stock.history(period="3mo")
        price_history = [
            {"date": str(idx.date()), "close": round(row["Close"], 2)}
            for idx, row in hist.iterrows()
        ]

        return {"quote": quote, "price_history": price_history, "source": "yfinance"}

    except ImportError:
        return {"quote": None, "note": "yfinance not installed. Run: pip install yfinance"}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"yfinance error: {exc}") from exc
