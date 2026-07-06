"""
routers/chat.py
---------------
Chat endpoint powered by Google Gemini.

POST /api/chat
  Body: { messages: [{role, content}], account_ids?: [str] }
  Returns: { reply: str, suggested_actions?: [...] }

The endpoint:
  1. Assembles live account + market data via context_builder.
  2. Injects it as a system prompt prefix on every turn.
  3. Forwards the full conversation history to Gemini so memory is persistent
     across turns (the client owns the history; we just re-send it each call).
  4. Parses any action items the model flags with a special marker and returns
     them as structured objects the frontend can pin to the dashboard.

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
from typing import Any

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


# ── System prompt ────────────────────────────────────────────────────────────

_SYSTEM_PREAMBLE = """You are an IBM seller intelligence assistant embedded in the Client Intelligence Agent (CIA) dashboard.
Your sole purpose is to help the seller close deals, protect renewals, and hit their quota.

PRIORITIES (in order):
1. Lowest-hanging fruit first — identify the quickest, highest-probability revenue actions.
2. Be specific and actionable — never give vague advice. Name the account, the IBM product, the dollar value, and the next step.
3. Ground every recommendation in the data provided — quota gaps, health scores, pipeline, renewal dates, news signals.
4. When you identify a concrete action item to surface on the dashboard, emit it on its own line in this exact format:
   ACTION_ITEM: {{"type": "<Cross-sell|Upsell|Renewal|Re-engagement|Retention|Advisory>", "description": "<one clear sentence>", "account_name": "<ACCOUNT NAME IN CAPS>", "confidence": <0.0-1.0>}}
5. Keep prose concise. Use bullet points for lists of recommendations.
6. You have persistent memory within this conversation — the user can ask follow-up questions, amend data, or drill into any account.

CURRENT DATA SNAPSHOT:
{context}
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
    system_prompt = _SYSTEM_PREAMBLE.format(context=context)

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    # Convert our message format to Gemini's Content list.
    # google-genai requires alternating user/model turns.
    contents: list[genai_types.Content] = []
    for msg in req.messages:
        role = "user" if msg.role == "user" else "model"
        contents.append(genai_types.Content(role=role, parts=[genai_types.Part(text=msg.content)]))

    cfg = genai_types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.4,
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
