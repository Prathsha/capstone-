"""
main.py
-------
App factory for the IBM Client Intelligence Agent backend.

This file is intentionally thin — it only:
  1. Creates the FastAPI instance
  2. Attaches CORS middleware
  3. Registers routers

Business logic lives in:
  routers/accounts.py  — account + dashboard endpoints
  routers/news.py      — news, financial, and stock endpoints

Shared utilities live in:
  config.py   — environment / settings
  data.py     — accounts data store
  queries.py  — per-client NewsAPI and Finnhub query strings
  mock.py     — fallback mock data generators
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers.accounts import router as accounts_router
from routers.news import router as news_router
from routers.chat import router as chat_router
from routers.export import router as export_router

app = FastAPI(
    title="IBM Client Intelligence Agent API",
    description="Backend for the IBM CIA seller dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts_router)
app.include_router(news_router)
app.include_router(chat_router)
app.include_router(export_router)
