"""
IBM Client Intelligence Agent — FastAPI Backend
================================================
Provides account data, market news, and financial intelligence
for the seller dashboard. API keys are placeholders — paste in real values.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import httpx
from datetime import datetime, timedelta
from typing import Optional, List

# ── API Key Placeholders ───────────────────────────────────────────────────────
# Replace these with real keys before deploying.
NEWS_API_KEY = "YOUR_NEWSAPI_KEY_HERE"          # https://newsapi.org
FINNHUB_API_KEY = "YOUR_FINNHUB_API_KEY_HERE"   # https://finnhub.io

app = FastAPI(
    title="IBM Client Intelligence Agent API",
    description="Backend for the IBM CIA seller dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load accounts JSON ─────────────────────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), "accounts.json")
with open(DATA_PATH) as f:
    _data = json.load(f)

ACCOUNTS: list = _data["accounts"]
SELLER: dict = _data["seller"]

# ── Helper: build a smart, specific news query ─────────────────────────────────

def _news_query(account_name: str) -> str:
    """
    Build a precise, company-specific query string that minimises false positives
    (e.g. "Lincoln" matching Abraham Lincoln articles).
    Uses the full legal name plus key disambiguating terms.
    """
    name = account_name.strip()

    # Canonical overrides for names that are ambiguous by themselves
    OVERRIDES = {
        "THE LINCOLN NATIONAL LIFE INSURANCE COMPANY": '"Lincoln National" (insurance OR financial OR LNC OR annuity OR retirement)',
        "SIEMENS": '"Siemens AG" OR "Siemens USA" (technology OR industrial OR energy OR automation)',
        "RICOH": '"Ricoh" (imaging OR document OR technology OR printing OR "digital services")',
        "QUEST DIAGNOSTICS": '"Quest Diagnostics" (lab OR diagnostics OR healthcare OR testing)',
        "SEI INVESTMENTS": '"SEI Investments" (asset management OR wealth OR financial)',
        "INDEPENDENCE BLUECROSS": '"Independence Blue Cross" OR "Independence BlueCross" (insurance OR healthcare OR plan)',
        "SUNGARD DATA SYSTEMS": '"SunGard" OR "Sungard Data Systems" (fintech OR data OR financial technology)',
        "SELECT MEDICAL CORP": '"Select Medical" (hospital OR rehabilitation OR healthcare)',
        "SAGENT M&C LLC": '"Sagent" (mortgage OR lending OR servicing OR M&C)',
    }

    if name.upper() in OVERRIDES:
        return OVERRIDES[name.upper()]

    # Default: wrap in quotes so it's an exact phrase match
    return f'"{name}"'


def _finnhub_query(account_name: str) -> str:
    """Short name for Finnhub company news searches."""
    SHORTS = {
        "THE LINCOLN NATIONAL LIFE INSURANCE COMPANY": "Lincoln National",
        "INDEPENDENCE BLUECROSS": "Independence Blue Cross",
        "SUNGARD DATA SYSTEMS": "SunGard Data Systems",
        "SELECT MEDICAL CORP": "Select Medical",
        "SAGENT M&C LLC": "Sagent Lending",
    }
    return SHORTS.get(account_name.upper(), account_name.title())


# ═══════════════════════════════════════════════════════════════════════════════
# ACCOUNTS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/accounts")
def get_accounts():
    """Return all accounts and seller quota summary."""
    return {"accounts": ACCOUNTS, "seller": SELLER}


@app.get("/api/accounts/{account_id}")
def get_account(account_id: str):
    """Return a single account by ID."""
    account = next((a for a in ACCOUNTS if a["id"] == account_id), None)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@app.get("/api/accounts/{account_id}/actions")
def get_account_actions(account_id: str):
    """Return pending and suggested actions for an account."""
    account = next((a for a in ACCOUNTS if a["id"] == account_id), None)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {
        "pending_actions": account.get("pending_actions", []),
        "suggested_actions": account.get("suggested_actions", []),
    }


@app.get("/api/dashboard")
def get_dashboard(account_ids: Optional[str] = Query(None)):
    """
    Aggregate dashboard data.
    Pass ?account_ids=acc-001,acc-002 to filter; omit for all accounts.
    """
    if account_ids:
        ids = [i.strip() for i in account_ids.split(",")]
        selected = [a for a in ACCOUNTS if a["id"] in ids]
    else:
        selected = ACCOUNTS

    all_pending = []
    all_suggested = []
    for acc in selected:
        for item in acc.get("pending_actions", []):
            all_pending.append({**item, "account_id": acc["id"], "account_name": acc["name"]})
        for item in acc.get("suggested_actions", []):
            all_suggested.append({**item, "account_id": acc["id"], "account_name": acc["name"]})

    # Sort pending by priority weight
    priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    all_pending.sort(key=lambda x: priority_order.get(x.get("priority", "low"), 3))

    # Sort suggested by confidence descending
    all_suggested.sort(key=lambda x: x.get("confidence", 0), reverse=True)

    total_quota = sum(a["quota"] for a in selected)
    total_closed = sum(a["closed"] for a in selected)
    total_pipeline = sum(a["pipeline"] for a in selected)

    return {
        "quota_summary": {
            "total_quota": total_quota,
            "closed": total_closed,
            "pipeline": total_pipeline,
            "attainment_pct": round(total_closed / total_quota * 100, 1) if total_quota else 0,
            "coverage_pct": round((total_closed + total_pipeline) / total_quota * 100, 1) if total_quota else 0,
        },
        "pending_actions": all_pending,
        "suggested_actions": all_suggested,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# NEWS & INTELLIGENCE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/news/{account_id}")
async def get_news(account_id: str, days_back: int = Query(30, ge=1, le=90)):
    """
    Fetch recent news articles for an account from NewsAPI.
    Uses precise, company-specific queries to avoid false positives.
    """
    account = next((a for a in ACCOUNTS if a["id"] == account_id), None)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if NEWS_API_KEY == "YOUR_NEWSAPI_KEY_HERE":
        return {"articles": _mock_news(account["name"]), "source": "mock"}

    query = _news_query(account["name"])
    from_date = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%d")

    params = {
        "q": query,
        "from": from_date,
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": 15,
        "apiKey": NEWS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get("https://newsapi.org/v2/everything", params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"NewsAPI error: {resp.text}")

    data = resp.json()
    articles = [
        {
            "source": a["source"]["name"],
            "title": a["title"],
            "description": a["description"],
            "url": a["url"],
            "published_at": a["publishedAt"],
            "image_url": a.get("urlToImage"),
        }
        for a in data.get("articles", [])
        if a.get("title") and "[Removed]" not in a.get("title", "")
    ]

    return {"articles": articles, "source": "newsapi", "query_used": query}


@app.get("/api/financial/{account_id}")
async def get_financial(account_id: str):
    """
    Fetch financial news and company profile from Finnhub for publicly traded accounts.
    Falls back gracefully for private companies.
    """
    account = next((a for a in ACCOUNTS if a["id"] == account_id), None)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    ticker = account.get("ticker")

    if FINNHUB_API_KEY == "YOUR_FINNHUB_API_KEY_HERE":
        return {"news": _mock_financial_news(account["name"]), "profile": _mock_profile(account), "source": "mock"}

    if not ticker:
        return {
            "news": [],
            "profile": None,
            "source": "finnhub",
            "note": "This account is privately held — no ticker symbol available.",
        }

    from_ts = int((datetime.utcnow() - timedelta(days=30)).timestamp())
    to_ts = int(datetime.utcnow().timestamp())

    async with httpx.AsyncClient(timeout=15.0) as client:
        news_resp, profile_resp = await _gather(
            client.get(
                "https://finnhub.io/api/v1/company-news",
                params={"symbol": ticker, "from": datetime.utcfromtimestamp(from_ts).strftime("%Y-%m-%d"),
                        "to": datetime.utcfromtimestamp(to_ts).strftime("%Y-%m-%d"),
                        "token": FINNHUB_API_KEY},
            ),
            client.get(
                "https://finnhub.io/api/v1/stock/profile2",
                params={"symbol": ticker, "token": FINNHUB_API_KEY},
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


@app.get("/api/stockquote/{account_id}")
async def get_stock_quote(account_id: str):
    """
    Fetch stock quote + basic financials from yfinance (via subprocess) for publicly traded accounts.
    """
    account = next((a for a in ACCOUNTS if a["id"] == account_id), None)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    ticker = account.get("ticker")
    if not ticker:
        return {"quote": None, "note": "Privately held — no stock data available."}

    try:
        import yfinance as yf
        stock = yf.Ticker(ticker)
        info = stock.info

        quote = {
            "ticker": ticker,
            "name": info.get("longName", account["name"]),
            "price": info.get("currentPrice") or info.get("regularMarketPrice"),
            "change_pct": round(
                ((info.get("currentPrice", 0) - info.get("previousClose", 1)) / info.get("previousClose", 1)) * 100, 2
            ) if info.get("currentPrice") and info.get("previousClose") else None,
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

        # 90-day price history
        hist = stock.history(period="3mo")
        price_history = [
            {"date": str(idx.date()), "close": round(row["Close"], 2)}
            for idx, row in hist.iterrows()
        ]

        return {"quote": quote, "price_history": price_history, "source": "yfinance"}

    except ImportError:
        return {"quote": None, "note": "yfinance not installed. Run: pip install yfinance"}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"yfinance error: {str(e)}")


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _gather(*coros):
    """Simple async gather replacement for httpx calls."""
    import asyncio
    return await asyncio.gather(*coros)


def _mock_news(account_name: str) -> list:
    short = account_name.split()[0].title()
    return [
        {
            "source": "Reuters",
            "title": f"{short} Reports Strong Q2 Results Amid Market Uncertainty",
            "description": f"{account_name} announced quarterly earnings that beat analyst expectations, citing operational efficiency gains.",
            "url": "#",
            "published_at": (datetime.utcnow() - timedelta(days=3)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Bloomberg",
            "title": f"{short} Expands Digital Transformation Initiative with New Technology Partners",
            "description": "The company announced a multi-year partnership to accelerate cloud migration and AI integration across business units.",
            "url": "#",
            "published_at": (datetime.utcnow() - timedelta(days=8)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Wall Street Journal",
            "title": f"Industry Analysts Upgrade {short} on Strong Operational Metrics",
            "description": "Several leading analysts raised their price targets following improved cost management and revenue guidance.",
            "url": "#",
            "published_at": (datetime.utcnow() - timedelta(days=14)).isoformat() + "Z",
            "image_url": None,
        },
    ]


def _mock_financial_news(account_name: str) -> list:
    short = account_name.split()[0].title()
    return [
        {
            "source": "Finnhub / MarketWatch",
            "title": f"{short} CFO Comments on Capital Allocation Strategy",
            "description": "Comments made at the investor day conference regarding planned capital expenditures for the next fiscal year.",
            "url": "#",
            "published_at": (datetime.utcnow() - timedelta(days=5)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Finnhub / CNBC",
            "title": f"Institutional Investors Increase Holdings in {short}",
            "description": "13F filings reveal increased institutional ownership as the company positions itself for growth.",
            "url": "#",
            "published_at": (datetime.utcnow() - timedelta(days=11)).isoformat() + "Z",
            "image_url": None,
        },
    ]


def _mock_profile(account: dict) -> dict:
    return {
        "name": account["name"],
        "ticker": account.get("ticker", "N/A"),
        "industry": account["industry"],
        "country": "US",
        "marketCapitalization": None,
        "note": "Mock profile — connect Finnhub API key for live data",
    }
