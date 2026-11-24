import datetime
import json
import unittest
from unittest import mock

from fastapi.testclient import TestClient

from app import main
from app.main import app
from app.services import naver


def _yesterday() -> datetime.date:
    return datetime.date.today() - datetime.timedelta(days=1)


class DataLabStudioTests(unittest.TestCase):
    def setUp(self):
        main._lookups.clear()
        self.client = TestClient(app)
        self.groups = [{"group_name": "선크림", "keywords": ["선크림"]}]

    def test_month_range_drops_the_month_in_progress(self):
        y = _yesterday()
        res = naver.search_naver_datalab_custom("2025-03-15", y.isoformat(), "month", self.groups)
        self.assertEqual(res["start_date"], "2025-03-01")
        last = datetime.date.fromisoformat(res["end_date"])
        self.assertEqual((last + datetime.timedelta(days=1)).day, 1)  # ends on a month's last day
        self.assertLessEqual(last, y)                                  # and that month has finished

    def test_week_range_is_whole_monday_weeks(self):
        res = naver.search_naver_datalab_custom("2026-03-04", "2026-08-27", "week", self.groups)
        self.assertEqual((res["start_date"], res["end_date"]), ("2026-03-02", "2026-08-30"))

    def test_example_data_has_one_point_per_month(self):
        with mock.patch.object(naver, "NAVER_CLIENT_ID", ""):
            res = naver.search_naver_datalab_custom("2025-01-01", "2025-12-31", "month", self.groups)
        periods = [p["period"] for p in res["results"][0]["data"]]
        self.assertFalse(res["is_live"])
        self.assertEqual(periods, [f"2025-{m:02d}-01" for m in range(1, 13)])

    def test_keys_are_sent_to_the_official_host_only(self):
        sent = []

        def fake(url, headers, body):
            sent.append((url, json.loads(body)))
            return [{"title": "선크림", "keywords": ["선크림"], "data": [
                {"period": "2025-01-01", "ratio": 50}, {"period": "2025-02-01", "ratio": 40}]}]

        with mock.patch.object(naver, "NAVER_CLIENT_ID", "id"), mock.patch.object(naver, "NAVER_CLIENT_SECRET", "secret"), \
                mock.patch.object(naver, "_request_datalab_full", side_effect=fake):
            res = naver.search_naver_datalab_custom("2025-01-10", "2025-02-20", "month", self.groups)
        self.assertTrue(res["is_live"])
        self.assertEqual([u for u, _ in sent], ["https://openapi.naver.com/v1/datalab/search"])
        self.assertEqual((sent[0][1]["startDate"], sent[0][1]["endDate"]), ("2025-01-01", "2025-02-28"))

    def test_bad_ranges_are_refused_with_a_message(self):
        future = (datetime.date.today() + datetime.timedelta(days=3)).isoformat()
        for start, end in (("2026-05-01", "2026-04-01"), ("2015-12-01", "2016-02-01"), ("2026-01-01", future), ("2026-1-x", "2026-02-01")):
            res = self.client.post("/api/datalab/search", json={
                "start_date": start, "end_date": end, "time_unit": "month", "keyword_groups": self.groups})
            self.assertEqual(res.status_code, 400, (start, end))
            self.assertTrue(res.json()["detail"])


if __name__ == "__main__":
    unittest.main()
