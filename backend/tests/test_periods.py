import datetime
import unittest

from app.services.periods import PeriodError, bucket, custom_window, is_google_weekly, period_key, period_starts, window

TODAY = datetime.date(2026, 11, 19)  # a Thursday


class WindowTests(unittest.TestCase):
    def test_day_window_is_the_last_30_full_days(self):
        w = window("day", TODAY)
        self.assertEqual((w.start, w.end), (datetime.date(2026, 10, 20), datetime.date(2026, 11, 18)))
        self.assertEqual(w.naver_time_unit, "date")
        self.assertEqual(w.google_timeframe, "2026-10-20 2026-11-18")
        self.assertEqual(w.points, 30)

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
        with self.assertRaises(PeriodError):
            window("year", TODAY)


class CustomWindowTests(unittest.TestCase):
    def test_week_range_is_widened_to_whole_weeks(self):
        w = custom_window("week", datetime.date(2026, 3, 4), datetime.date(2026, 8, 27), TODAY)
        self.assertEqual((w.start, w.end), (datetime.date(2026, 3, 2), datetime.date(2026, 8, 30)))
        self.assertTrue(w.custom)
        self.assertEqual(w.points, 26)
        self.assertEqual(w.google_timeframe, "2026-03-02 2026-08-30")  # under 270 days: Google gives days

    def test_long_week_range_asks_google_from_sunday(self):
        w = custom_window("week", datetime.date(2024, 1, 1), datetime.date(2025, 12, 28), TODAY)
        self.assertEqual(w.google_timeframe, "2023-12-31 2025-12-27")

    def test_unfinished_last_period_is_dropped(self):
        w = custom_window("week", datetime.date(2026, 10, 1), datetime.date(2026, 11, 18), TODAY)
        self.assertEqual(w.end, datetime.date(2026, 11, 15))      # this week is not over
        m = custom_window("month", datetime.date(2026, 6, 10), datetime.date(2026, 11, 18), TODAY)
        self.assertEqual((m.start, m.end), (datetime.date(2026, 6, 1), datetime.date(2026, 10, 31)))

    def test_day_range_is_kept_as_chosen(self):
        w = custom_window("day", datetime.date(2026, 9, 1), datetime.date(2026, 9, 30), TODAY)
        self.assertEqual((w.start, w.end, w.points), (datetime.date(2026, 9, 1), datetime.date(2026, 9, 30), 30))

    def test_limits(self):
        with self.assertRaises(PeriodError):
            custom_window("day", datetime.date(2025, 1, 1), datetime.date(2025, 12, 31), TODAY)
        custom_window("day", datetime.date(2026, 1, 1), datetime.date(2026, 9, 27), TODAY)  # 270 days
        with self.assertRaises(PeriodError):
            custom_window("week", datetime.date(2016, 1, 4), datetime.date(2026, 1, 4), TODAY)
        w = custom_window("month", datetime.date(2016, 1, 1), datetime.date(2026, 10, 31), TODAY)
        self.assertEqual(w.points, 130)
        with self.assertRaises(PeriodError):
            custom_window("day", datetime.date(2026, 11, 18), datetime.date(2026, 11, 19), TODAY)


class PeriodKeyTests(unittest.TestCase):
    def test_keys(self):
        self.assertEqual(period_key("day", "2026-11-18"), "2026-11-18")
        self.assertEqual(period_key("month", "2026-11-18"), "2026-11")
        self.assertEqual(period_key("week", "2026-11-12"), "2026-11-09")  # Thursday -> Monday
        self.assertEqual(period_key("week", "2026-11-08"), "2026-11-02")  # a daily Sunday stays in its week
        self.assertEqual(period_key("week", "2026-11-08", google_weeks=True), "2026-11-09")  # Google week -> next Monday
        self.assertEqual(period_key("month", "2026-08-30", google_weeks=True), "2026-09")  # most of its days

    def test_google_weekly_detection(self):
        self.assertTrue(is_google_weekly(["2026-11-01", "2026-11-08"]))
        self.assertFalse(is_google_weekly(["2026-11-01", "2026-11-02"]))
        self.assertFalse(is_google_weekly(["2026-10-01", "2026-11-01"]))

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
