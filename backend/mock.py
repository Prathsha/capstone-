"""
mock.py
-------
Fallback mock data returned when API keys are not configured.
These functions are only called when the relevant API key is absent.
"""

from datetime import datetime, timedelta


def mock_news(account_name: str) -> list[dict]:
    """Return three plausible mock news articles for *account_name*."""
    short = account_name.split()[0].title()
    now = datetime.utcnow()
    return [
        {
            "source": "Reuters",
            "title": f"{short} Reports Strong Q2 Results Amid Market Uncertainty",
            "description": (
                f"{account_name} announced quarterly earnings that beat analyst "
                "expectations, citing operational efficiency gains."
            ),
            "url": "#",
            "published_at": (now - timedelta(days=3)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Bloomberg",
            "title": f"{short} Expands Digital Transformation Initiative with New Technology Partners",
            "description": (
                "The company announced a multi-year partnership to accelerate cloud "
                "migration and AI integration across business units."
            ),
            "url": "#",
            "published_at": (now - timedelta(days=8)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Wall Street Journal",
            "title": f"Industry Analysts Upgrade {short} on Strong Operational Metrics",
            "description": (
                "Several leading analysts raised their price targets following improved "
                "cost management and revenue guidance."
            ),
            "url": "#",
            "published_at": (now - timedelta(days=14)).isoformat() + "Z",
            "image_url": None,
        },
    ]


def mock_financial_news(account_name: str) -> list[dict]:
    """Return two plausible mock financial news articles for *account_name*."""
    short = account_name.split()[0].title()
    now = datetime.utcnow()
    return [
        {
            "source": "Finnhub / MarketWatch",
            "title": f"{short} CFO Comments on Capital Allocation Strategy",
            "description": (
                "Comments made at the investor day conference regarding planned capital "
                "expenditures for the next fiscal year."
            ),
            "url": "#",
            "published_at": (now - timedelta(days=5)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Finnhub / CNBC",
            "title": f"Institutional Investors Increase Holdings in {short}",
            "description": (
                "13F filings reveal increased institutional ownership as the company "
                "positions itself for growth."
            ),
            "url": "#",
            "published_at": (now - timedelta(days=11)).isoformat() + "Z",
            "image_url": None,
        },
    ]


def mock_profile(account: dict) -> dict:
    """Return a mock Finnhub-style company profile for *account*."""
    return {
        "name": account["name"],
        "ticker": account.get("ticker", "N/A"),
        "industry": account["industry"],
        "country": "US",
        "marketCapitalization": None,
        "note": "Mock profile — connect Finnhub API key for live data",
    }
