"""
backend/api/index.py
--------------------
Vercel serverless entry point.
Vercel looks for `app` in this file to serve as the ASGI handler.
All /api/* requests are routed here by vercel.json.
"""

import sys
import os

# Make sure the backend package root is on the path so relative imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from main import app  # noqa: F401  — Vercel picks up `app` automatically
