"""
data.py
-------
Single source of truth for account and seller data.
Reads accounts.json once at import time.

To add or remove clients, edit accounts.json only — nothing here needs to change.
"""

import json
import os

_DATA_PATH = os.path.join(os.path.dirname(__file__), "accounts.json")

with open(_DATA_PATH) as _f:
    _payload = json.load(_f)

ACCOUNTS: list[dict] = _payload["accounts"]
SELLER: dict = _payload["seller"]


def find_account(account_id: str) -> dict | None:
    """Return the account dict for *account_id*, or None if not found."""
    return next((a for a in ACCOUNTS if a["id"] == account_id), None)
