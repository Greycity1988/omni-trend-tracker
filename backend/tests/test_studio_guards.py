import unittest
from unittest import mock

from fastapi.testclient import TestClient

from app import main
from app.main import app


class StudioGuardTests(unittest.TestCase):
    def setUp(self):
        main._lookups.clear()
        self.client = TestClient(app)

    def test_studio_searches_share_the_lookup_limit(self):
        with mock.patch.object(main, "search_google_trends_custom", return_value={
            "timeframe": "today 3-m", "geo": "KR", "gprop": "", "keywords": ["a"],
            "timeline": [], "summaries": {}, "is_live": False,
        }):
            codes = [self.client.post("/api/google/search", json={"keywords": ["a"]}).status_code
                     for _ in range(main.RATE_LIMIT_LOOKUPS + 1)]
        self.assertEqual(codes[:-1], [200] * main.RATE_LIMIT_LOOKUPS)
        self.assertEqual(codes[-1], 429)

    def test_long_keywords_are_rejected(self):
        res = self.client.post("/api/google/search", json={"keywords": ["x" * 41]})
        self.assertEqual(res.status_code, 400)

    def test_server_errors_do_not_echo_exception_text(self):
        secret = "https://example.com/x?client_secret=SECRET123"
        with mock.patch.object(main, "search_google_trends_custom", side_effect=RuntimeError(secret)):
            res = self.client.post("/api/google/search", json={"keywords": ["선크림"]})
        self.assertEqual(res.status_code, 500)
        self.assertNotIn("SECRET123", res.text)

    def test_google_studio_accepts_only_offered_options(self):
        for bad in ({"timeframe": "all"}, {"geo": "../x"}, {"gprop": "images&x=1"}):
            res = self.client.post("/api/google/search", json={"keywords": ["a"], **bad})
            self.assertEqual(res.status_code, 422, bad)

    def test_studio_handlers_do_not_block_the_event_loop(self):
        # Sync handlers run in FastAPI's thread pool; an async one would stall every other request.
        import inspect
        self.assertFalse(inspect.iscoroutinefunction(main.google_trends_search))
        self.assertFalse(inspect.iscoroutinefunction(main.datalab_search))

    def test_hourly_google_points_keep_their_hour(self):
        import pandas as pd
        idx = pd.to_datetime(["2026-11-18 09:00", "2026-11-18 10:00", "2026-11-18 11:00"])
        df = pd.DataFrame({"a": [10, 20, 30], "isPartial": [False, False, False]}, index=idx)
        with mock.patch("pytrends.request.TrendReq") as req:
            req.return_value.interest_over_time.return_value = df
            req.return_value.related_queries.return_value = {}
            body = self.client.post("/api/google/search", json={"keywords": ["a"], "timeframe": "now 1-d"}).json()
        self.assertEqual([p["period"] for p in body["timeline"]],
                         ["2026-11-18 09:00", "2026-11-18 10:00", "2026-11-18 11:00"])

    def test_instagram_endpoints_are_gone(self):
        # Meta's Ad Library returns only political/issue ads outside the EU, so OTT no longer
        # offers Instagram numbers (2026-11-19).
        self.assertEqual(self.client.post("/api/meta/search", json={"keywords": ["a"]}).status_code, 404)
        self.assertEqual(self.client.post("/api/meta/refresh-token").status_code, 404)
        self.assertEqual(set(self.client.get("/api/keys/status").json()), {"naver", "google"})


if __name__ == "__main__":
    unittest.main()


class ClientIpTests(unittest.TestCase):
    def test_forwarded_for_is_used_only_on_vercel(self):
        from starlette.requests import Request
        scope = {"type": "http", "headers": [(b"x-forwarded-for", b"203.0.113.9, 10.0.0.1")], "client": ("10.0.0.1", 1)}
        req = Request(scope)
        with mock.patch.dict("os.environ", {"VERCEL": "1"}):
            self.assertEqual(main.client_ip(req), "203.0.113.9")
        with mock.patch.dict("os.environ", {}, clear=True):
            self.assertEqual(main.client_ip(req), "10.0.0.1")  # a forged header is ignored off Vercel

    def test_vercel_entry_point_exposes_the_app(self):
        import importlib.util, pathlib
        path = pathlib.Path(__file__).resolve().parents[2] / "api" / "index.py"
        spec = importlib.util.spec_from_file_location("vercel_index", path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        self.assertIs(mod.app, main.app)


class VercelRequirementsTests(unittest.TestCase):
    def test_root_requirements_are_plain_pins(self):
        """Vercel's Python builder cannot parse "-r" includes in the root requirements.txt."""
        from pathlib import Path
        root = Path(__file__).resolve().parents[2] / "requirements.txt"
        lines = [l.strip() for l in root.read_text().splitlines() if l.strip() and not l.strip().startswith("#")]
        self.assertTrue(lines)
        for line in lines:
            self.assertRegex(line, r"^[A-Za-z0-9_.\-\[\]]+==[0-9][0-9A-Za-z.]*$", line)
