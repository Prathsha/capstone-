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
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")

    # CORS — extend the list for staging/prod origins
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]


settings = _Settings()
