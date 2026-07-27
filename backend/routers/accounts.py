"""
routers/accounts.py
-------------------
Endpoints for account data and the seller dashboard.

Routes
------
GET /api/accounts                       — all accounts + seller summary
GET /api/accounts/{account_id}          — single account
GET /api/accounts/{account_id}/actions  — pending + suggested actions
GET /api/dashboard                      — aggregated quota + action summary
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from data import ACCOUNTS, SELLER, find_account

router = APIRouter(prefix="/api")

_PRIORITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}


@router.get("/accounts")
def get_accounts():
    """Return all accounts and the seller quota summary."""
    return {"accounts": ACCOUNTS, "seller": SELLER}


@router.get("/accounts/{account_id}")
def get_account(account_id: str):
    """Return a single account by ID."""
    account = find_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.get("/accounts/{account_id}/actions")
def get_account_actions(account_id: str):
    """Return pending and suggested actions for an account."""
    account = find_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {
        "pending_actions": account.get("pending_actions", []),
        "suggested_actions": account.get("suggested_actions", []),
    }


@router.get("/dashboard")
def get_dashboard(account_ids: Optional[str] = Query(None)):
    """
    Aggregate dashboard data across accounts.
    Pass ?account_ids=acc-001,acc-002 to filter; omit for all accounts.
    """
    if account_ids:
        ids = {i.strip() for i in account_ids.split(",")}
        selected = [a for a in ACCOUNTS if a["id"] in ids]
    else:
        selected = ACCOUNTS

    all_pending: list[dict] = []
    all_suggested: list[dict] = []

    for acc in selected:
        for item in acc.get("pending_actions", []):
            all_pending.append({**item, "account_id": acc["id"], "account_name": acc["name"]})
        for item in acc.get("suggested_actions", []):
            all_suggested.append({**item, "account_id": acc["id"], "account_name": acc["name"]})

    all_pending.sort(key=lambda x: _PRIORITY_ORDER.get(x.get("priority", "low"), 3))
    all_suggested.sort(key=lambda x: x.get("confidence", 0), reverse=True)

    total_quota = sum(a["quota"] for a in selected)
    total_closed = sum(a["closed"] for a in selected)
    total_pipeline = sum(a["pipeline"] for a in selected)

    # Industry-standard enterprise win rate applied to raw pipeline to avoid
    # overstating progress. Sellers need ~3x coverage to reliably hit quota.
    WIN_RATE = 0.35
    weighted_pipeline = round(total_pipeline * WIN_RATE)
    remaining_quota = max(total_quota - total_closed, 0)
    # Pipeline needed = how much face-value pipeline is required to cover the gap
    # (remaining quota / win rate). Negative means the seller already has enough.
    pipeline_needed = max(round(remaining_quota / WIN_RATE) - total_pipeline, 0)

    return {
        "quota_summary": {
            "total_quota": total_quota,
            "closed": total_closed,
            "pipeline": total_pipeline,
            "weighted_pipeline": weighted_pipeline,
            "pipeline_needed": pipeline_needed,
            "win_rate": WIN_RATE,
            "attainment_pct": round(total_closed / total_quota * 100, 1) if total_quota else 0,
            "coverage_pct": round((total_closed + weighted_pipeline) / total_quota * 100, 1) if total_quota else 0,
        },
        "pending_actions": all_pending,
        "suggested_actions": all_suggested,
    }
