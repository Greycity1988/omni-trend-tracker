"""A period at 0 (too little search volume) gives no percentage, no vote and plain wording."""
import unittest
from unittest import mock

from fastapi.testclient import TestClient

from app import main
from app.services import google, naver
from app.services.periods import window


def live(name, change, rng=None):
    def fetch(keyword, w):
        return {
            "platform": name, "display_name": name, "icon": "x",
            "relative_index": 30.0, "change_pct": change, "range_change_pct": rng,
            "status": "cooling", "primary_metric_label": "a", "primary_metric_value": "b",
            "secondary_metric_label": "c", "secondary_metric_value": "d",
            "top_related_keywords": [], "related_keywords_live": False,
            "timeline": [{"date": "2026-09", "value": 10.6}, {"date": "2026-10", "value": 0.0}],
            "is_live": True,
        }
    return fetch


class TooLittleDataTests(unittest.TestCase):
    def setUp(self):
        main._cache.clear()
        main._lookups.clear()
        self.client = TestClient(main.app)

    def test_summary_and_verdict_skip_an_unmeasurable_change(self):
        with mock.patch.dict(main.FETCHERS, {"naver": live("naver", 9.0), "google": live("google", None)}):
            body = self.client.get("/api/trend/린넨셔츠?unit=month").json()
        self.assertEqual(body["overall_sentiment"], "상승")  # Naver alone decides
        self.assertIn("구글 트렌드 데이터 부족", body["summary_insight"])
        self.assertNotIn("-100", body["summary_insight"])
        self.assertIsNone(body["platforms"]["google"]["change_pct"])

    def test_no_measurable_change_means_no_verdict(self):
        with mock.patch.dict(main.FETCHERS, {"naver": live("naver", None), "google": live("google", None)}):
            body = self.client.get("/api/trend/린넨셔츠?unit=month").json()
        self.assertEqual(body["overall_sentiment"], "판단 불가")

    def test_cards_say_too_little_data(self):
        w = window("month")
        g = google._google_result("린넨셔츠", w, [{"date": "2026-09", "value": 10.6}, {"date": "2026-10", "value": 0.0}], True, [])
        self.assertIsNone(g["change_pct"])
        self.assertEqual(g["secondary_metric_value"], "데이터 부족")
        n = naver._result("x", w, [{"date": "2026-09", "value": 0.0}, {"date": "2026-10", "value": 5.0}], True)
        self.assertIsNone(n["change_pct"])
        self.assertIsNone(n["range_change_pct"])

    def test_studios_do_not_report_minus_100(self):
        groups = [{"group_name": "a", "keywords": ["a"]}]
        rows = [{"title": "a", "keywords": ["a"], "data": [{"period": "2025-01-01", "ratio": 10}, {"period": "2025-02-01", "ratio": 0}]}]
        with mock.patch.multiple(naver, NAVER_CLIENT_ID="id", NAVER_CLIENT_SECRET="s"), \
                mock.patch.object(naver, "_query_datalab", return_value=rows):
            res = naver.search_naver_datalab_custom("2025-01-01", "2025-02-28", "month", groups)
        self.assertIsNone(res["results"][0]["change_pct"])


if __name__ == "__main__":
    unittest.main()
