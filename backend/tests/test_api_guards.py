"""API guard tests. External platform calls are replaced, so nothing leaves this machine.

Run from backend/:  .venv/bin/python -m unittest discover -s tests -t .
"""
import os
import subprocess
import sys
import unittest
from unittest import mock

from fastapi.testclient import TestClient

from app import main
from app.services import meta


# Each platform reports on its own dates, the way the real ones do
TIMELINES = {
    "naver": [("2026-01-01", 40.0), ("2026-02-01", 80.0)],
    "google": [("2026-01-04", 10.0), ("2026-01-11", 30.0), ("2026-02-01", 100.0)],
    "pinterest": [("2026-01-15", 99.0)],
    "meta": [("2026-01-15", 99.0), ("2026-03-15", 100.0)],
}
LIVE = {"naver", "google"}


def fake_platform(name):
    def fetch(keyword):
        return {
            "platform": name,
            "display_name": name,
            "icon": "x",
            "relative_index": 80.0 if name == "naver" else 50.0,
            "weekly_change_pct": 1.0,
            "status": "rising",
            "primary_metric_label": "a",
            "primary_metric_value": "b",
            "secondary_metric_label": "c",
            "secondary_metric_value": "d",
            "top_related_keywords": [f"{keyword} {name}"],
            "related_keywords_live": name == "google",
            "timeline": [{"date": d, "value": v} for d, v in TIMELINES[name]],
            "is_live": name in LIVE,
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

    def enable(self, *names):
        p = mock.patch.object(main, "ENABLED_PLATFORMS", list(names))
        p.start()
        self.addCleanup(p.stop)

    def tearDown(self):
        for p in self.patches:
            p.stop()

    def test_keyword_is_trimmed_and_served(self):
        r = self.client.get("/api/trend/%20선크림%20%20추천%20")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["keyword"], "선크림 추천")

    def test_each_platform_reports_whether_its_numbers_are_live(self):
        self.enable("naver", "google", "pinterest", "meta")
        platforms = self.client.get("/api/trend/선크림").json()["platforms"]
        self.assertEqual({k: v["is_live"] for k, v in platforms.items()},
                         {"naver": True, "google": True, "pinterest": False, "meta": False})

    def test_pinterest_is_off_by_default(self):
        body = self.client.get("/api/trend/선크림").json()
        self.assertEqual(set(body["platforms"]), {"naver", "google", "meta"})
        self.fetchers["pinterest"].assert_not_called()
        self.assertTrue(all(point["pinterest"] is None for point in body["timeline"]))

    def test_timeline_has_one_point_per_month_without_zero_fill(self):
        timeline = self.client.get("/api/trend/선크림").json()["timeline"]
        self.assertEqual([p["date"] for p in timeline], ["2026-01", "2026-02", "2026-03"])
        self.assertEqual(timeline[0]["google"], 20.0)   # two weekly values averaged
        self.assertIsNone(timeline[2]["naver"])         # no value that month, not 0

    def test_summary_fields_use_live_platforms_only(self):
        body = self.client.get("/api/trend/선크림").json()
        self.assertEqual(body["dominant_platform"], "네이버 데이터랩")
        self.assertEqual(body["peak_month"], "2026-02")  # meta's higher example values are ignored
        self.assertEqual(body["overall_sentiment"], "상승")
        self.assertNotIn("total_estimated_reach", body)
        self.assertIn("인스타그램", body["summary_insight"].split("예시 데이터 채널")[1])

    def test_no_live_platform_means_no_conclusions(self):
        self.enable("pinterest", "meta")
        body = self.client.get("/api/trend/선크림").json()
        self.assertIsNone(body["dominant_platform"])
        self.assertIsNone(body["peak_month"])
        self.assertEqual(body["overall_sentiment"], "판단 불가")
        self.assertIn("예시 데이터", body["summary_insight"])

    def test_related_keywords_carry_their_own_live_flag_and_no_made_up_score(self):
        keywords = self.client.get("/api/trend/선크림").json()["cross_platform_keywords"]
        self.assertEqual({k["platform"]: k["is_live"] for k in keywords},
                         {"네이버": False, "구글": True, "인스타": False})
        self.assertTrue(all("relevance" not in k for k in keywords))

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
            return meta.lookup_hashtag_media(keyword), calls

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

    def test_example_card_is_not_live_and_makes_no_network_call(self):
        with mock.patch.object(meta, "META_ACCESS_TOKEN", self.TOKEN), \
                mock.patch("requests.get") as get:
            result = meta.fetch_meta_trend("선크림")
        get.assert_not_called()
        self.assertFalse(result["is_live"])
        self.assertNotIn("demographics", result)


class ExampleDataTests(unittest.TestCase):
    def test_example_curve_is_the_same_across_processes(self):
        # Built-in hash() is salted per process; the example curve must not change on restart.
        code = ("from app.services import pinterest; "
                "print([p['value'] for p in pinterest.fetch_pinterest_trend('선크림')['timeline']])")
        runs = {
            subprocess.run([sys.executable, "-c", code], capture_output=True, text=True,
                           env={**os.environ, "PYTHONHASHSEED": seed}, check=True).stdout
            for seed in ("1", "2")
        }
        self.assertEqual(len(runs), 1)


if __name__ == "__main__":
    unittest.main()
