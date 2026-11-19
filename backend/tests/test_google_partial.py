import datetime
import unittest
from unittest import mock

import pandas as pd
from fastapi.testclient import TestClient

from app.main import app
from app.services.google import drop_partial_rows, fetch_google_trend
from app.services.periods import change_pct, window


def _frame(rows):
    idx = pd.to_datetime([r[0] for r in rows])
    return pd.DataFrame(
        {"선크림": [r[1] for r in rows], "isPartial": [r[2] for r in rows]}, index=idx
    )


class GooglePartialPeriodTests(unittest.TestCase):
    """The in-progress period must not count as a drop (audit 2026-11-16, item 3)."""

    def test_drop_partial_rows_removes_unfinished_period(self):
        df = _frame([("2026-11-02", 80, False), ("2026-11-09", 80, False), ("2026-11-16", 20, True)])
        self.assertEqual(list(drop_partial_rows(df)["선크림"]), [80, 80])

    def test_string_flags_are_understood(self):
        df = _frame([("2026-11-09", 80, "False"), ("2026-11-16", 20, "True")])
        self.assertEqual(len(drop_partial_rows(df)), 1)

    def test_change_pct(self):
        self.assertEqual(change_pct([50, 60]), 20.0)
        self.assertEqual(change_pct([0, 3]), 300.0)
        self.assertEqual(change_pct([70]), 0.0)

    def test_weekly_overview_uses_full_weeks_in_the_window(self):
        w = window("week")
        last_sunday = w.end - datetime.timedelta(days=7)  # the Google week before our last Monday
        rows = [(str(last_sunday - datetime.timedelta(days=7)), 70, False),
                (str(last_sunday), 77, False),
                (str(last_sunday + datetime.timedelta(days=7)), 10, True)]
        with mock.patch("pytrends.request.TrendReq") as req:
            inst = req.return_value
            inst.interest_over_time.return_value = _frame(rows)
            inst.related_queries.return_value = {}
            data = fetch_google_trend("선크림", "week")
            self.assertEqual(inst.build_payload.call_args.kwargs["timeframe"], w.google_timeframe)
        self.assertTrue(data["is_live"])
        self.assertEqual(data["change_pct"], 10.0)
        self.assertEqual(data["relative_index"], 77)
        # filed under the Monday after each Sunday
        self.assertEqual(data["timeline"][-1]["date"], str(last_sunday + datetime.timedelta(days=1)))
        self.assertEqual(data["secondary_metric_label"], "전주 대비")

    def test_studio_search_ignores_partial_week(self):
        df = _frame([("2026-11-02", 40, False), ("2026-11-09", 50, False), ("2026-11-16", 5, True)])
        with mock.patch("pytrends.request.TrendReq") as req:
            inst = req.return_value
            inst.interest_over_time.return_value = df
            inst.related_queries.return_value = {}
            res = TestClient(app).post(
                "/api/google/search", json={"keywords": ["선크림"], "timeframe": "today 3-m", "geo": "KR"}
            )
        self.assertEqual(res.status_code, 200)
        summary = res.json()["summaries"]["선크림"]
        self.assertEqual(summary["latest_value"], 50)
        self.assertEqual(summary["change_pct"], 25.0)


if __name__ == "__main__":
    unittest.main()
