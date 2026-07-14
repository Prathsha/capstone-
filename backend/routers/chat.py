"""
routers/chat.py
---------------
Chat endpoint powered by Google Gemini.

POST /api/chat
  Body: { messages: [{role, content}], account_ids?: [str] }
  Returns: { reply: str, suggested_actions?: [...], doc_type?: str }

The endpoint:
  1. Assembles live account + market data via context_builder.
  2. Injects it as a system prompt prefix on every turn.
  3. Forwards the full conversation history to Gemini so memory is persistent
     across turns (the client owns the history; we just re-send it each call).
  4. Parses any action items the model flags with a special marker and returns
     them as structured objects the frontend can pin to the dashboard.
  5. Detects intent keywords in the last user message to switch between:
     - General seller chat (_SYSTEM_PREAMBLE, temp 0.4)
     - Client Technical Strategy document (_TECH_STRATEGY_PROMPT, temp 0.2)
     - Sales Play suggestions (_SALES_PLAY_PROMPT, temp 0.2)

CONVERSATION MEMORY
-------------------
Memory is client-side: the frontend accumulates the full message list and sends
it with each request.  This avoids any server-side session state and means the
context can never go stale between browser refreshes.

ACTION ITEM PROTOCOL
--------------------
When the model wants to surface a pinnable action it includes a line like:
  ACTION_ITEM: {"type": "Cross-sell", "description": "...", "account_name": "...", "confidence": 0.85}
The endpoint strips these lines from the visible reply and returns them in
`suggested_actions` so the frontend can offer a "Pin to Dashboard" button.
"""

import json
import re
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config import settings
from context_builder import build_context

router = APIRouter(prefix="/api")

# ── Pydantic models ──────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str        # "user" | "model"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    account_ids: list[str] | None = None   # None = use all accounts


class SuggestedAction(BaseModel):
    id: str
    type: str
    description: str
    account_name: str
    confidence: float
    source: str = "gemini"


class ChatResponse(BaseModel):
    reply: str
    suggested_actions: list[SuggestedAction] = []
    doc_type: Optional[str] = None


# ── System prompts ───────────────────────────────────────────────────────────

_SYSTEM_PREAMBLE = """You are an IBM seller intelligence assistant embedded in the Client Intelligence Agent (CIA) dashboard.
Your sole purpose is to help the seller close deals, protect renewals, and hit their quota.

You handle two kinds of requests in this default mode:
1. Direct questions about entitlements, renewals, and account data sourced from Fastpass, ISC, and EPM — e.g. "What does this account own?", "When does this renew?", "What stage is this opportunity in?"
2. General account guidance and next-best-action recommendations that don't require a full structured document.

PRIORITIES (in order):
1. Lowest-hanging fruit first — identify the quickest, highest-probability revenue actions.
2. Be specific and actionable — never give vague advice. Name the account, the IBM product, the dollar value, and the next step.
3. Ground every answer and recommendation in the data provided — quota gaps, health scores, pipeline, entitlements, renewal dates, news signals.
4. When a question touches IBM-internal system or product vocabulary (Fastpass, ISC, EPM, or a product name like Turbonomic or QRadar), explain it in plain English inline the first time it appears in your reply — do not assume the seller already knows the acronym or product.
5. When you identify a concrete action item to surface on the dashboard, emit it on its own line in this exact format:
   ACTION_ITEM: {{"type": "<Cross-sell|Upsell|Renewal|Re-engagement|Retention|Advisory>", "description": "<one clear sentence>", "account_name": "<ACCOUNT NAME IN CAPS>", "confidence": <0.0-1.0>}}
6. Keep prose concise. Use bullet points for lists of recommendations.
7. You have persistent memory within this conversation — the user can ask follow-up questions, amend data, or drill into any account.
8. If asked about an account, product, or entitlement that the current data snapshot doesn't cover, say so plainly rather than guessing.

CURRENT DATA SNAPSHOT:
{context}
"""

_TECH_STRATEGY_PROMPT = """You are an IBM seller intelligence assistant. Your task is to generate a one-page Client Technical Strategy document.

This document must fit on a single printed page — target 500-650 words total. Use compact formatting: tables and single-line bullets, never multi-sentence paragraphs within a section. Every section below must still appear, just compressed. You MUST populate every section. Do not omit any section. Use ONLY data provided in the context — do not fabricate numbers, dates, or product names. If a data point is not available in the context, write "Not available in current data."

CURRENT DATA SNAPSHOT:
{context}

Output the document in this exact structure:

## Client Technical Strategy: [CLIENT NAME from context]
**Prepared by:** [SELLER NAME from context] | **Date:** {today}

### 1. Executive Summary
(2-3 sentences max. State the situation and the single biggest opportunity — not a list of everything.)

### 2. Client Profile
(2 bullets max — industry/region/tier/health score on one line, key priority signal inferred from news and pipeline on the other.)

### 3. IBM Installed Base
(One-line list grouped by product family, using the UT Lvl 15/17/20/30 hierarchy visible in the data. No sub-bullets.)

### 4. Competitive Landscape
(One line per competitive product: Vendor: Product | Displacement Risk: [High/Medium/Low] | IBM Replacement: [product]. No separate paragraph per entry.)

### 5. Active Opportunities
| Opportunity | Value | Stage | Forecast | Product | Key Notes |
|---|---|---|---|---|---|
(Populate every row from the Pipeline Opportunities (CQ) and Pipeline Opportunities (NQ) sections of the context. Do not leave this table empty.)

### 6. Strategic Recommendations
(Exactly 3, numbered. Each one line: N. **Recommendation** → Rationale → Product → Value → Next step. Do not expand into multiple bullets per recommendation.)

### 7. Proposed Next Steps — 30/60/90 Day Plan
- 30 days: (one line)
- 60 days: (one line)
- 90 days: (one line)
"""

_SALES_PLAY_PROMPT = """You are an IBM seller intelligence assistant. Your task is to suggest specific, data-grounded sales plays for the account as a one-page brief.

Rules:
- Generate exactly 3 plays — prioritize the highest-signal plays only, not a comprehensive list.
- Keep total output under 400 words. Every field below is one line, never more than one sentence.
- Every play MUST cite a specific data point from the context (a named pipeline opportunity, a named competitive product installed, a specific news headline, or a specific IBM installed product with quantity).
- Do not suggest products that are already closed/won unless recommending expansion or upsell.
- Ground all product messaging in the IBM Data Platform Product Reference section of the context.
- Be specific: name the IBM product, the competitor to displace (if any), and the exact next action.

CURRENT DATA SNAPSHOT:
{context}

Output the plays in this exact structure:

## Sales Play Recommendations: [CLIENT NAME from context]

### Play 1: [PLAY NAME]
- **Trigger:** (one line — quote the specific signal from the context data directly)
- **IBM Product:** (one line — specific product name from the Data Platform reference or installed base)
- **Competitive Displacement Opportunity:** (one line — name the competitor product to displace, or "N/A — expansion play")
- **Estimated Value:** (one line — reference a specific dollar value from the pipeline, or size from installed quantities)
- **Key Message:** (one sentence, quotable, drawn directly from the IBM Data Platform Product Reference section)
- **Recommended Action:** (one line — who to contact and by when)

(Repeat the Play structure for exactly 2 more plays, incrementing the play number. Do not generate a 4th play.)
"""

# ── Action item extraction ───────────────────────────────────────────────────

_ACTION_RE = re.compile(r"^ACTION_ITEM:\s*(\{.+\})\s*$", re.MULTILINE)
_action_counter = 0


def _extract_actions(text: str) -> tuple[str, list[dict[str, Any]]]:
    """Strip ACTION_ITEM lines from the reply and return them as dicts."""
    global _action_counter
    actions: list[dict[str, Any]] = []
    clean_lines: list[str] = []

    for line in text.splitlines():
        m = _ACTION_RE.match(line)
        if m:
            try:
                data = json.loads(m.group(1))
                _action_counter += 1
                actions.append({
                    "id": f"ai-chat-{_action_counter}",
                    "type": data.get("type", "Advisory"),
                    "description": data.get("description", ""),
                    "account_name": data.get("account_name", ""),
                    "confidence": float(data.get("confidence", 0.75)),
                    "source": "gemini",
                })
            except (json.JSONDecodeError, ValueError):
                clean_lines.append(line)   # malformed — keep as text
        else:
            clean_lines.append(line)

    return "\n".join(clean_lines).strip(), actions


# Models to try in order — first one that succeeds wins.
# List is derived from client.models.list() for this API key.
# Ordered fastest/cheapest first so free-tier quotas go furthest.
_MODEL_PREFERENCE = [
    "gemini-flash-latest",     # alias — often has a separate quota bucket
    "gemini-2.0-flash-lite",   # lowest quota cost
    "gemini-2.0-flash",        # standard flash
]


# ── Endpoint ─────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not configured. Add it to your .env file.",
        )

    try:
        from google import genai
        from google.genai import types as genai_types
        from google.genai.errors import ClientError as GeminiClientError
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="google-genai is not installed. Run: pip install google-genai",
        )

    # Build live context (concurrent data fetches)
    context = await build_context(req.account_ids)

    # ── Intent detection: choose prompt + temperature based on last user message ──
    last_msg = req.messages[-1].content.lower() if req.messages else ""
    from datetime import date as _date
    today_str = _date.today().strftime("%B %d, %Y")

    _STRATEGY_KEYWORDS = {"technical strategy", "strategy document", "tech strategy", "client strategy"}
    _SALES_PLAY_KEYWORDS = {"sales play", "sales plays", "suggest plays", "recommend plays"}

    if any(kw in last_msg for kw in _STRATEGY_KEYWORDS):
        system_prompt = _TECH_STRATEGY_PROMPT.format(context=context, today=today_str)
        temperature = 0.2
        doc_type = "strategy"
    elif any(kw in last_msg for kw in _SALES_PLAY_KEYWORDS):
        system_prompt = _SALES_PLAY_PROMPT.format(context=context)
        temperature = 0.2
        doc_type = "sales_play"
    else:
        system_prompt = _SYSTEM_PREAMBLE.format(context=context)
        temperature = 0.4
        doc_type = None

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    # Convert our message format to Gemini's Content list.
    # google-genai requires alternating user/model turns.
    contents: list[genai_types.Content] = []
    for msg in req.messages:
        role = "user" if msg.role == "user" else "model"
        contents.append(genai_types.Content(role=role, parts=[genai_types.Part(text=msg.content)]))

    cfg = genai_types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=temperature,
    )

    # Try each model in preference order; fall through on quota/rate errors.
    last_error: str = "Unknown error"
    for model_name in _MODEL_PREFERENCE:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=cfg,
            )
            raw_reply = response.text
            clean_reply, actions = _extract_actions(raw_reply)
            return ChatResponse(
                reply=clean_reply,
                suggested_actions=[SuggestedAction(**a) for a in actions],
                doc_type=doc_type,
            )
        except GeminiClientError as exc:
            last_error = str(exc)
            # 429 = quota/rate-limit → try next model
            # 400 = bad request (won't improve by switching models) → surface immediately
            if exc.code != 429:
                raise HTTPException(status_code=502, detail=f"Gemini error: {last_error}") from exc
            continue
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Gemini error: {exc}") from exc

    # All models exhausted their quota
    raise HTTPException(
        status_code=429,
        detail=(
            "All Gemini models are currently rate-limited on your free-tier key. "
            "Please wait a minute and try again, or upgrade to a paid Gemini API plan. "
            f"Last error: {last_error}"
        ),
    )
