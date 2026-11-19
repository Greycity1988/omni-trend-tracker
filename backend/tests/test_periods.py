import datetime
import unittest

from app.services.periods import bucket, period_key, period_starts, window

TODAY = datetime.date(2026, 11, 19)  # a Thursday


class WindowTests(unittest.TestCase):
    def test_day_window_is_the_last_30_full_days(self):
        w = window("day", TODAY)
        self.assertEqual((w.start, w.end), (datetime.date(2026, 10, 20), datetime.date(2026, 11, 18)))
        self.assertEqual(w.naver_time_unit, "date")
        self.assertEqual(w.google_timeframe, "2026-10-20 2026-11-18")
        self.assertEqual(len(period_starts(w)), 30)

    def test_week_window_is_52_full_monday_weeks(self):
        w = window("week", TODAY)
        self.assertEqual(w.end, datetime.date(2026, 11, 15))      # last Sunday
        self.assertEqual(w.start.weekday(), 0)                     # a Monday
        self.assertEqual((w.end - w.start).days + 1, 7 * 52)
        self.assertEqual(w.google_timeframe, "2025-11-16 2026-11-14")  # Sunday to Saturday
        self.assertEqual(len(period_starts(w)), 52)

    def test_week_window_on_a_monday_ends_yesterday(self):
        self.assertEqual(window("week", datetime.date(2026, 11, 16)).end, datetime.date(2026, 11, 15))

    def test_month_window_is_the_last_12_full_months(self):
        w = window("month", TODAY)
        self.assertEqual((w.start, w.end), (datetime.date(2025, 11, 1), datetime.date(2026, 10, 31)))
        self.assertEqual([d.isoformat()[:7] for d in period_starts(w)][:2], ["2025-11", "2025-12"])
        self.assertEqual(len(period_starts(w)), 12)

    def test_unknown_unit(self):
        with self.assertRaises(ValueError):
            window("year", TODAY)


class PeriodKeyTests(unittest.TestCase):
    def test_keys(self):
        self.assertEqual(period_key("day", "2026-11-18"), "2026-11-18")
        self.assertEqual(period_key("month", "2026-11-18"), "2026-11")
        self.assertEqual(period_key("week", "2026-11-12"), "2026-11-09")  # Thursday -> Monday
        self.assertEqual(period_key("week", "2026-11-08"), "2026-11-09")  # Google's Sunday week -> next Monday

    def test_bucket_averages_and_drops_points_outside_the_window(self):
        w = window("month", TODAY)
        points = [
            {"date": "2025-10-26", "value": 99.0},   # before the window
            {"date": "2026-10-04", "value": 40.0},
            {"date": "2026-10-11", "value": 60.0},
            {"date": "2026-11-01", "value": 5.0},    # current month, not finished
        ]
        self.assertEqual(bucket(points, w), [{"date": "2026-10", "value": 50.0}])


if __name__ == "__main__":
    unittest.main()
