"""Vercel entry point: the FastAPI backend in backend/app served as one Python function.

vercel.json sends every /api/* request here; the app's routes already start with /api.
Keys (NAVER_CLIENT_ID, NAVER_CLIENT_SECRET) come from the Vercel project's environment variables.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: E402,F401  (Vercel looks for `app`)
