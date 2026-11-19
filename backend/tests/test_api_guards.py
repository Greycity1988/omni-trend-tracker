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


# Fetchers return one point per period (already bucketed), keyed like the real ones
TIMELINES = {
    "naver": [("2026-01", 40.0), ("2026-02", 80.0)],
    "google": [("2026-01", 20.0), ("2026-02", 100.0), ("2026-03", 50.0)],
}
LIVE = {"naver", "google"}


def fake_platform(name):
    def fetch(keyword, unit="month"):
        return {
            "platform": name,
            "display_name": name,
            "icon": "x",
            "relative_index": 80.0 if name == "naver" else 50.0,
            "change_pct": 1.0,
            "range_change_pct": 30.0 if name == "naver" else 5.0,
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
        self.fetchers = {n: fake_platform(n) for n in ("naver", "google")}
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
        LIVE.discard("google")
        self.addCleanup(LIVE.add, "google")
        platforms = self.client.get("/api/trend/선크림").json()["platforms"]
        self.assertEqual({k: v["is_live"] for k, v in platforms.items()}, {"naver": True, "google": False})

    def test_only_naver_and_google_are_reported(self):
        body = self.client.get("/api/trend/선크림").json()
        self.assertEqual(set(body["platforms"]), {"naver", "google"})
        self.assertEqual(set(body["timeline"][0]), {"date", "naver", "google"})

    def test_timeline_lines_up_periods_without_zero_fill(self):
        timeline = self.client.get("/api/trend/선크림").json()["timeline"]
        self.assertEqual([p["date"] for p in timeline], ["2026-01", "2026-02", "2026-03"])
        self.assertEqual(timeline[0]["google"], 20.0)
        self.assertIsNone(timeline[2]["naver"])         # no value that period, not 0

    def test_unit_is_passed_to_every_fetcher_and_echoed(self):
        body = self.client.get("/api/trend/선크림?unit=week").json()
        self.assertEqual(body["unit"], "week")
        self.assertFalse(body["custom"])
        for f in self.fetchers.values():
            keyword, w = f.call_args.args
            self.assertEqual((keyword, w.unit, w.custom), ("선크림", "week", False))
        self.assertIn("전주 대비", body["summary_insight"])

    def test_chosen_range_is_widened_echoed_and_summarised(self):
        body = self.client.get("/api/trend/선크림?unit=week&start=2026-03-04&end=2026-08-27").json()
        self.assertEqual((body["start"], body["end"], body["custom"]), ("2026-03-02", "2026-08-30", True))
        _, w = self.fetchers["google"].call_args.args
        self.assertEqual((w.start.isoformat(), w.end.isoformat()), ("2026-03-02", "2026-08-30"))
        self.assertIn("선택 기간 첫 주 대비 마지막 주: 네이버 데이터랩 +30.0%", body["summary_insight"])

    def test_chosen_ranges_are_cached_separately(self):
        self.client.get("/api/trend/선크림?unit=day&start=2026-09-01&end=2026-09-30")
        self.client.get("/api/trend/선크림?unit=day&start=2026-09-01&end=2026-09-30")
        self.client.get("/api/trend/선크림?unit=day&start=2026-08-01&end=2026-08-31")
        self.assertEqual(self.fetchers["naver"].call_count, 2)

    def test_bad_ranges_are_refused_before_any_external_call(self):
        cases = {
            "unit=day&start=2026-01-01": "모두",                 # end missing
            "unit=day&start=2026-09-30&end=2026-09-01": "늦습니다",
            "unit=day&start=2015-12-01&end=2016-02-01": "2016-01-01",
            "unit=day&start=2025-01-01&end=2025-12-31": "9개월",   # too long for daily
            "unit=month&start=2026-03-03&end=2026-03-20": "2개 이상",
            "unit=day&start=2026-01-01&end=2999-01-01": "어제",
        }
        for query, words in cases.items():
            r = self.client.get(f"/api/trend/선크림?{query}")
            self.assertEqual(r.status_code, 400, query)
            self.assertIn(words, r.json()["detail"], query)
        self.fetchers["naver"].assert_not_called()

    def test_each_unit_is_cached_separately(self):
        for unit in ("day", "week", "month", "day"):
            self.client.get(f"/api/trend/선크림?unit={unit}")
        self.assertEqual(self.fetchers["naver"].call_count, 3)

    def test_unknown_unit_is_rejected(self):
        self.assertEqual(self.client.get("/api/trend/선크림?unit=year").status_code, 422)
        self.fetchers["naver"].assert_not_called()

    def test_summary_fields_use_live_platforms_only(self):
        LIVE.discard("google")
        self.addCleanup(LIVE.add, "google")
        body = self.client.get("/api/trend/선크림").json()
        self.assertEqual(body["dominant_platform"], "네이버 데이터랩")
        self.assertEqual(body["peak_period"], "2026-02")  # google's higher example values are ignored
        self.assertEqual(body["overall_sentiment"], "상승")
        self.assertIn("구글 트렌드", body["summary_insight"].split("예시 데이터 채널")[1])

    def test_no_live_platform_means_no_conclusions(self):
        LIVE.clear()
        self.addCleanup(LIVE.update, {"naver", "google"})
        body = self.client.get("/api/trend/선크림").json()
        self.assertIsNone(body["dominant_platform"])
        self.assertIsNone(body["peak_period"])
        self.assertEqual(body["overall_sentiment"], "판단 불가")
        self.assertIn("예시 데이터", body["summary_insight"])

    def test_related_keywords_carry_their_own_live_flag_and_no_made_up_score(self):
        keywords = self.client.get("/api/trend/선크림").json()["cross_platform_keywords"]
        self.assertEqual({k["platform"]: k["is_live"] for k in keywords}, {"네이버": False, "구글": True})
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

    def _cache_ttl_with_example_naver(self, naver_keys):
        LIVE.discard("naver")
        self.addCleanup(LIVE.add, "naver")
        self.enable("naver", "google")
        with mock.patch.object(main, "NAVER_CLIENT_ID", "id" if naver_keys else ""), \
                mock.patch.object(main, "NAVER_CLIENT_SECRET", "secret" if naver_keys else ""), \
                mock.patch.object(main.time, "monotonic", return_value=1000.0):
            self.client.get("/api/trend/ttl")
        key = next(k for k in main._cache if k.startswith("ttl|month|"))
        return main._cache[key][0] - 1000.0

    def test_keyless_naver_does_not_turn_the_cache_off(self):
        # Without keys Naver is always example data; that is not a glitch to retry in 5 seconds.
        self.assertEqual(self._cache_ttl_with_example_naver(naver_keys=False), main.CACHE_TTL_SECONDS)

    def test_configured_naver_that_failed_is_retried_soon(self):
        self.assertEqual(self._cache_ttl_with_example_naver(naver_keys=True), 5)

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


class ExampleDataTests(unittest.TestCase):
    def test_example_curve_is_the_same_across_processes(self):
        # Built-in hash() is salted per process; the example curve must not change on restart.
        code = ("from app.services import naver; naver.NAVER_CLIENT_ID = ''; "
                "print([p['value'] for p in naver.fetch_naver_trend('선크림', 'week')['timeline']])")
        runs = {
            subprocess.run([sys.executable, "-c", code], capture_output=True, text=True,
                           env={**os.environ, "PYTHONHASHSEED": seed}, check=True).stdout
            for seed in ("1", "2")
        }
        self.assertEqual(len(runs), 1)


if __name__ == "__main__":
    unittest.main()
