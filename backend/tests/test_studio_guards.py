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

    def test_instagram_endpoints_are_gone(self):
        # Meta's Ad Library returns only political/issue ads outside the EU, so OTT no longer
        # offers Instagram numbers (2026-11-19).
        self.assertEqual(self.client.post("/api/meta/search", json={"keywords": ["a"]}).status_code, 404)
        self.assertEqual(self.client.post("/api/meta/refresh-token").status_code, 404)
        self.assertEqual(set(self.client.get("/api/keys/status").json()), {"naver", "google"})


if __name__ == "__main__":
    unittest.main()
