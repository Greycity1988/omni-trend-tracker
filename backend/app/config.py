import os
from dotenv import load_dotenv

load_dotenv()

NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID", "")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET", "")
PINTEREST_ACCESS_TOKEN = os.getenv("PINTEREST_ACCESS_TOKEN", "")
META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN", "")
PORT = int(os.getenv("PORT", "8000"))

# Local-only by default. Set HOST explicitly only when the backend is deployed behind a real host.
HOST = os.getenv("HOST", "127.0.0.1")
RELOAD = os.getenv("RELOAD", "") == "1"

# Browser origins allowed to call the API (comma-separated in ALLOWED_ORIGINS to override)
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5174,http://127.0.0.1:5174",
    ).split(",") if o.strip()
]
