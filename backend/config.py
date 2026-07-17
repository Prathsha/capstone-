"""
config.py
---------
Loads environment variables and exposes typed settings used across the app.
Add new env vars here; import `settings` everywhere else.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


class _Settings:
    NEWS_API_KEY: str | None = os.getenv("NEWS_API_KEY")
    FINNHUB_API_KEY: str | None = os.getenv("FINNHUB_API_KEY")

    # CORS — localhost for local dev; CORS_ORIGIN env var for Vercel/prod.
    # On Vercel, set CORS_ORIGIN to your deployment URL, e.g.
    #   https://my-capstone.vercel.app
    # If not set, all origins are allowed (safe because the API is read-only).
    _cors_env: str | None = os.getenv("CORS_ORIGIN")
    CORS_ORIGINS: list[str] = (
        [_cors_env, "http://localhost:3000"]
        if _cors_env
        else ["*"]
    )


settings = _Settings()
