"""
queries.py
----------
NewsAPI and Finnhub query strings for every client account.

WHY THIS FILE EXISTS
--------------------
NewsAPI uses Lucene-style syntax.  Without an explicit AND between a quoted
company name and a filter group the operator defaults to OR, which turns a
narrow company search into a flood of loosely related articles.

Correct form:  "Company Name" AND (term1 OR term2 OR term3)
Wrong form:    "Company Name" (term1 OR term2 OR term3)   ← treated as OR

EDITING GUIDE
-------------
* To change a client's query, find its entry in NEWS_QUERIES below.
* The key is the account name in UPPER CASE, matching accounts.json exactly.
* Keep the quoted company name as the first token so NewsAPI anchors on it.
* Use AND to require the company name plus at least one domain keyword.
* Avoid generic words (e.g. "testing", "data", "services") that appear in
  sports, entertainment, or unrelated tech coverage.
* If a company has a well-known legal alias, include it with OR *inside* the
  quoted-name group: ("Company Inc" OR "Company Corp") AND (domain terms).

FINNHUB_SHORT_NAMES
-------------------
Finnhub's company-news endpoint works best with a short common name.
Add an entry here whenever the key in accounts.json is a long legal name.
"""

# ---------------------------------------------------------------------------
# NewsAPI — one entry per client that needs disambiguation.
# Accounts NOT listed here fall back to an exact-phrase match on their name.
# ---------------------------------------------------------------------------

NEWS_QUERIES: dict[str, str] = {

    # ── Financial Services ──────────────────────────────────────────────────

    "THE LINCOLN NATIONAL LIFE INSURANCE COMPANY": (
        '"Lincoln National" AND (insurance OR annuity OR retirement OR LNC OR financial)'
    ),

    "SEI INVESTMENTS": (
        '"SEI Investments" AND ("asset management" OR wealth OR SEIC OR "financial services")'
    ),

    "SUNGARD DATA SYSTEMS": (
        '("SunGard" OR "Sungard Data Systems") AND (fintech OR "financial technology" OR "capital markets")'
    ),

    "SAGENT M&C LLC": (
        '"Sagent" AND (mortgage OR lending OR servicing OR "loan servicing")'
    ),

    # ── Healthcare ──────────────────────────────────────────────────────────

    "QUEST DIAGNOSTICS": (
        '"Quest Diagnostics" AND (laboratory OR clinical OR healthcare OR DGX)'
    ),

    "INDEPENDENCE BLUECROSS": (
        '("Independence Blue Cross" OR "Independence BlueCross") AND (insurance OR healthcare OR "health plan")'
    ),

    "SELECT MEDICAL CORP": (
        '"Select Medical" AND (hospital OR rehabilitation OR healthcare OR SEM)'
    ),

    # ── Industrial / Technology ─────────────────────────────────────────────

    "SIEMENS": (
        '("Siemens AG" OR "Siemens USA") AND (industrial OR automation OR energy OR technology OR SIEGY)'
    ),

    "RICOH": (
        '"Ricoh" AND (imaging OR document OR printing OR "digital services" OR RICOY)'
    ),
}


# ---------------------------------------------------------------------------
# Finnhub — short common name used for company-news API lookups.
# Accounts NOT listed here use account["name"].title() as a fallback.
# ---------------------------------------------------------------------------

FINNHUB_SHORT_NAMES: dict[str, str] = {
    "THE LINCOLN NATIONAL LIFE INSURANCE COMPANY": "Lincoln National",
    "INDEPENDENCE BLUECROSS": "Independence Blue Cross",
    "SUNGARD DATA SYSTEMS": "SunGard Data Systems",
    "SELECT MEDICAL CORP": "Select Medical",
    "SAGENT M&C LLC": "Sagent Lending",
}


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def news_query(account_name: str) -> str:
    """
    Return the NewsAPI query string for *account_name*.
    Falls back to an exact-phrase match if no override is registered.
    """
    return NEWS_QUERIES.get(account_name.strip().upper(), f'"{account_name.strip()}"')


def finnhub_short_name(account_name: str) -> str:
    """Return the short display name used for Finnhub lookups."""
    return FINNHUB_SHORT_NAMES.get(account_name.strip().upper(), account_name.title())
