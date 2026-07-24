"""
mock.py
-------
Fallback mock data returned when API keys are not configured.
URLs point to real Google News searches so articles are always clickable.
"""

from datetime import datetime, timedelta
from urllib.parse import quote_plus


def _gnews_url(query: str) -> str:
    """Return a Google News search URL for *query*."""
    return f"https://news.google.com/search?q={quote_plus(query)}"


def mock_news(account_name: str) -> list[dict]:
    """Return three plausible sample news articles with real Google News links."""
    short = account_name.split()[0].title()
    # Use a clean search term — strip legal suffixes for cleaner Google results
    search_name = (
        account_name
        .replace("THE ", "")
        .replace(" LIFE INSURANCE COMPANY", "")
        .replace(" DATA SYSTEMS", "")
        .replace(" M&C LLC", "")
        .replace(" CORP", "")
        .title()
    )
    now = datetime.utcnow()
    return [
        {
            "source": "Google News",
            "title": f"{short} Q2 2026 Earnings and Business Update",
            "description": (
                f"Latest coverage of {account_name} financial results, operational updates, "
                "and strategic announcements from Q2 2026."
            ),
            "url": _gnews_url(f'"{search_name}" earnings 2026'),
            "published_at": (now - timedelta(days=3)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Google News",
            "title": f"{short} Technology and Digital Transformation News",
            "description": (
                f"Recent technology partnerships, cloud migration initiatives, "
                f"and digital transformation coverage for {account_name}."
            ),
            "url": _gnews_url(f'"{search_name}" technology digital transformation'),
            "published_at": (now - timedelta(days=8)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Google News",
            "title": f"{short} — Industry News and Analyst Coverage",
            "description": (
                "Analyst upgrades, industry reports, and competitive landscape coverage "
                f"relevant to {account_name}."
            ),
            "url": _gnews_url(f'"{search_name}" analyst 2026'),
            "published_at": (now - timedelta(days=14)).isoformat() + "Z",
            "image_url": None,
        },
    ]


def mock_financial_news(account_name: str) -> list[dict]:
    """Return two plausible sample financial news articles with real Google News links."""
    short = account_name.split()[0].title()
    search_name = short
    now = datetime.utcnow()
    return [
        {
            "source": "Google News",
            "title": f"{short} Capital Allocation and Investor Relations",
            "description": (
                "Coverage of investor day comments, capital expenditure plans, "
                f"and financial guidance from {account_name} leadership."
            ),
            "url": _gnews_url(f'"{search_name}" investor capital 2026'),
            "published_at": (now - timedelta(days=5)).isoformat() + "Z",
            "image_url": None,
        },
        {
            "source": "Google News",
            "title": f"Institutional Activity and Analyst Ratings: {short}",
            "description": (
                "13F filings, institutional ownership changes, and analyst rating updates "
                f"for {account_name}."
            ),
            "url": _gnews_url(f'"{search_name}" institutional analyst rating'),
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
