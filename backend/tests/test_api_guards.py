"""API guard tests. External platform calls are replaced, so nothing leaves this machine.

Run from backend/:  .venv/bin/python -m unittest discover -s tests -t .
"""
import unittest
from unittest import mock

from fastapi.testclient import TestClient

from app import main
from app.services import meta


def fake_platform(name):
    def fetch(keyword):
        return {
            "platform": name,
            "display_name": name,
            "icon": "x",
            "relative_index": 50.0,
            "estimated_monthly_volume": 1000,
            "weekly_change_pct": 1.0,
            "status": "rising",
            "primary_metric_label": "a",
            "primary_metric_value": "b",
            "secondary_metric_label": "c",
            "secondary_metric_value": "d",
            "top_related_keywords": [f"{keyword} 추천"],
            "timeline": [{"date": "2026-01-01", "value": 50.0}],
        }
    return mock.Mock(side_effect=fetch)


class ApiGuardTests(unittest.TestCase):
    def setUp(self):
        main._cache.clear()
        main._lookups.clear()
        self.fetchers = {n: fake_platform(n) for n in ("naver", "google", "pinterest", "meta")}
        self.patches = [
            mock.patch.object(main, f"fetch_{n}_trend", f) for n, f in self.fetchers.items()
        ]
        for p in self.patches:
            p.start()
        self.client = TestClient(main.app)

    def tearDown(self):
        for p in self.patches:
            p.stop()

    def test_keyword_is_trimmed_and_served(self):
        r = self.client.get("/api/trend/%20선크림%20%20추천%20")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["keyword"], "선크림 추천")

    def test_too_long_keyword_is_rejected_before_any_external_call(self):
        r = self.client.get("/api/trend/" + "가" * (main.MAX_KEYWORD_LENGTH + 1))
        self.assertEqual(r.status_code, 400)
        self.fetchers["naver"].assert_not_called()

    def test_control_characters_are_rejected(self):
        r = self.client.get("/api/trend/abc%00def")
        self.assertEqual(r.status_code, 400)
        r = self.client.get("/api/trend/abc%E2%80%8Bdef")  # zero-width space
        self.assertEqual(r.status_code, 400)

    def test_repeat_lookup_is_served_from_cache(self):
        self.client.get("/api/trend/선크림")
        self.client.get("/api/trend/선크림")
        self.assertEqual(self.fetchers["naver"].call_count, 1)

    def test_uncached_lookups_are_rate_limited(self):
        for i in range(main.RATE_LIMIT_LOOKUPS):
            self.assertEqual(self.client.get(f"/api/trend/kw{i}").status_code, 200)
        self.assertEqual(self.client.get("/api/trend/one-more").status_code, 429)
        # a cached keyword is still served while limited
        self.assertEqual(self.client.get("/api/trend/kw0").status_code, 200)

    def test_cors_allows_only_configured_origins(self):
        ok = self.client.get("/api/health", headers={"Origin": "http://localhost:5174"})
        self.assertEqual(ok.headers.get("access-control-allow-origin"), "http://localhost:5174")
        other = self.client.get("/api/health", headers={"Origin": "https://example.com"})
        self.assertIsNone(other.headers.get("access-control-allow-origin"))
        self.assertIsNone(ok.headers.get("access-control-allow-credentials"))


class MetaTokenHandlingTests(unittest.TestCase):
    TOKEN = "test-token-not-real"

    def run_fetch(self, keyword):
        calls = []

        def fake_get(url, headers=None, params=None, timeout=None):
            calls.append((url, headers or {}, params or {}))
            res = mock.Mock(status_code=200)
            if url.endswith("/me"):
                res.json.return_value = {"id": "1", "name": "Real Name"}
            elif url.endswith("/me/accounts"):
                res.json.return_value = {"data": [{"instagram_business_account": {"id": "77"}}]}
            elif url.endswith("/ig_hashtag_search"):
                res.json.return_value = {"data": [{"id": "999"}]}
            else:
                res.json.return_value = {"data": []}
            return res

        with mock.patch.object(meta, "META_ACCESS_TOKEN", self.TOKEN), \
                mock.patch("requests.get", side_effect=fake_get):
            return meta.fetch_meta_trend(keyword), calls

    def test_token_is_sent_in_header_never_in_url(self):
        _, calls = self.run_fetch("선크림")
        self.assertEqual(len(calls), 4)
        for url, headers, params in calls:
            self.assertNotIn(self.TOKEN, url)
            self.assertNotIn("access_token", url)
            self.assertNotIn(self.TOKEN, str(params))
            self.assertEqual(headers.get("Authorization"), f"Bearer {self.TOKEN}")

    def test_keyword_cannot_add_query_parameters(self):
        _, calls = self.run_fetch("a&fields=email&user_id=1")
        url, _, params = calls[2]
        self.assertNotIn("&", url)
        self.assertEqual(params["user_id"], "77")
        self.assertEqual(params["q"], "a&fields=email&user_id=1")

    def test_account_owner_name_is_not_returned(self):
        result, _ = self.run_fetch("선크림")
        self.assertNotIn("Real Name", str(result))


if __name__ == "__main__":
    unittest.main()
