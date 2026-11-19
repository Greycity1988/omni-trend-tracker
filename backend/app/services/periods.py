"""Time windows for the cross-channel view: day, week or month.

Every window holds complete periods only (no today, no current week, no current month), so the
last point is never a half-filled period that looks like a drop.
"""
import datetime
from dataclasses import dataclass
from typing import Optional

UNITS = ("day", "week", "month")


@dataclass(frozen=True)
class Window:
    unit: str
    start: datetime.date  # first day of the first period
    end: datetime.date    # last day of the last period
    naver_time_unit: str  # DataLab timeUnit
    google_start: datetime.date
    google_end: datetime.date
    label: str            # 일 / 주 / 월
    span_text: str        # shown in summaries, e.g. "최근 12개월"
    points: int

    @property
    def google_timeframe(self) -> str:
        return f"{self.google_start.isoformat()} {self.google_end.isoformat()}"

    @property
    def change_label(self) -> str:
        return {"day": "전일 대비", "week": "전주 대비", "month": "전월 대비"}[self.unit]


def window(unit: str, today: Optional[datetime.date] = None) -> Window:
    today = today or datetime.date.today()
    if unit == "day":
        # Last 30 full days. Google returns daily points for ranges under about 9 months.
        end = today - datetime.timedelta(days=1)
        start = end - datetime.timedelta(days=29)
        return Window("day", start, end, "date", start, end, "일", "최근 30일", 30)
    if unit == "week":
        # Last 52 full Monday-to-Sunday weeks. Google weeks run Sunday to Saturday, so its range
        # starts and ends one day earlier; each Google week is filed under the Monday after its Sunday.
        end = today - datetime.timedelta(days=today.weekday() + 1)  # last Sunday
        start = end - datetime.timedelta(days=7 * 52 - 1)          # a Monday
        one = datetime.timedelta(days=1)
        return Window("week", start, end, "week", start - one, end - one, "주", "최근 52주", 52)
    if unit == "month":
        first_of_month = today.replace(day=1)
        end = first_of_month - datetime.timedelta(days=1)
        start = first_of_month.replace(year=first_of_month.year - 1)
        return Window("month", start, end, "month", start, end, "월", "최근 12개월", 12)
    raise ValueError(f"unknown unit: {unit}")


def period_key(unit: str, date_str: str) -> str:
    """The period a dated point belongs to: YYYY-MM-DD for days and weeks (the Monday), YYYY-MM for months."""
    if unit == "month":
        return date_str[:7]
    d = datetime.date.fromisoformat(date_str[:10])
    if unit == "week":
        if d.weekday() == 6:  # a Google week starting on Sunday belongs to the Monday after it
            d += datetime.timedelta(days=1)
        d -= datetime.timedelta(days=d.weekday())
    return d.isoformat()


def period_starts(w: Window) -> list:
    """Start date of every period in the window, oldest first."""
    if w.unit == "day":
        return [w.start + datetime.timedelta(days=i) for i in range(w.points)]
    if w.unit == "week":
        return [w.start + datetime.timedelta(days=7 * i) for i in range(w.points)]
    starts, d = [], w.start
    while d <= w.end:
        starts.append(d)
        d = (d.replace(day=28) + datetime.timedelta(days=4)).replace(day=1)
    return starts


def change_pct(series: list) -> float:
    """Change of the last period against the one before it, in percent."""
    if len(series) < 2:
        return 0.0
    prev_val = series[-2]
    return round(((series[-1] - prev_val) / max(prev_val, 1)) * 100, 1)


def bucket(points: list, w: Window) -> list:
    """Average dated points into the window's periods; periods outside the window are dropped.

    Returns [{"date": period key, "value": average}] oldest first.
    """
    first, last = period_key(w.unit, w.start.isoformat()), period_key(w.unit, w.end.isoformat())
    groups: dict = {}
    for p in points:
        key = period_key(w.unit, p["date"])
        if first <= key <= last:
            groups.setdefault(key, []).append(p["value"])
    return [{"date": k, "value": round(sum(v) / len(v), 1)} for k, v in sorted(groups.items())]
