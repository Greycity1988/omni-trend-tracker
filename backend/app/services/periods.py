"""Time windows for the cross-channel view: day, week or month, preset or chosen by the user.

Every window holds complete periods only (nothing after yesterday, no half-finished week or
month), so the last point is never a half-filled period that looks like a drop.
"""
import datetime
from dataclasses import dataclass
from typing import Optional

UNITS = ("day", "week", "month")
ONE_DAY = datetime.timedelta(days=1)

# Naver DataLab has data from 2016-01-01.
EARLIEST = datetime.date(2016, 1, 1)
# Google Trends returns daily points only for ranges under about 9 months and weekly points up to
# 5 years; longer ranges come back monthly. Units that Google cannot serve are refused.
MAX_DAYS = {"day": 270, "week": 5 * 365 + 1, "month": None}
GOOGLE_DAILY_LIMIT_DAYS = 269

LABEL = {"day": "일", "week": "주", "month": "월"}
CHANGE_LABEL = {"day": "전일 대비", "week": "전주 대비", "month": "전월 대비"}


class PeriodError(ValueError):
    """A chosen range the app cannot serve; the message is shown to the user."""


@dataclass(frozen=True)
class Window:
    unit: str
    start: datetime.date  # first day of the first period
    end: datetime.date    # last day of the last period
    span_text: str        # shown in summaries, e.g. "최근 12개월" or "2026-03-02 ~ 2026-08-30"
    custom: bool = False

    @property
    def naver_time_unit(self) -> str:
        return {"day": "date", "week": "week", "month": "month"}[self.unit]

    @property
    def label(self) -> str:
        return LABEL[self.unit]

    @property
    def change_label(self) -> str:
        return CHANGE_LABEL[self.unit]

    @property
    def days(self) -> int:
        return (self.end - self.start).days + 1

    @property
    def google_timeframe(self) -> str:
        # Google weeks run Sunday to Saturday. For a weekly answer, ask one day earlier so each
        # Google week lines up with one of ours (it is filed under the Monday after its Sunday).
        if self.unit == "week" and self.days > GOOGLE_DAILY_LIMIT_DAYS:
            return f"{(self.start - ONE_DAY).isoformat()} {(self.end - ONE_DAY).isoformat()}"
        return f"{self.start.isoformat()} {self.end.isoformat()}"

    @property
    def points(self) -> int:
        return len(period_starts(self))


def _month_start(d: datetime.date) -> datetime.date:
    return d.replace(day=1)


def _next_month(d: datetime.date) -> datetime.date:
    return (d.replace(day=28) + datetime.timedelta(days=4)).replace(day=1)


def window(unit: str, today: Optional[datetime.date] = None) -> Window:
    """The preset window for a unit: last 30 days, last 52 weeks or last 12 months."""
    today = today or datetime.date.today()
    if unit == "day":
        end = today - ONE_DAY
        return Window("day", end - datetime.timedelta(days=29), end, "최근 30일")
    if unit == "week":
        end = today - datetime.timedelta(days=today.weekday() + 1)  # last Sunday
        return Window("week", end - datetime.timedelta(days=7 * 52 - 1), end, "최근 52주")
    if unit == "month":
        first_of_month = _month_start(today)
        return Window("month", first_of_month.replace(year=first_of_month.year - 1),
                      first_of_month - ONE_DAY, "최근 12개월")
    raise PeriodError(f"알 수 없는 단위입니다: {unit}")


def custom_window(unit: str, start: datetime.date, end: datetime.date,
                  today: Optional[datetime.date] = None) -> Window:
    """A user-chosen range, widened to whole periods and trimmed to finished ones.

    A week runs Monday to Sunday and a month from the 1st to its last day. The range is widened
    so the chosen days are covered; a last period that has not finished yet is dropped.
    """
    if unit not in UNITS:
        raise PeriodError(f"알 수 없는 단위입니다: {unit}")
    today = today or datetime.date.today()
    yesterday = today - ONE_DAY
    if start > end:
        raise PeriodError("시작일이 종료일보다 늦습니다.")
    if start < EARLIEST:
        raise PeriodError("네이버 데이터랩은 2016-01-01부터 조회할 수 있습니다.")
    if end > yesterday:
        raise PeriodError("종료일은 어제까지 고를 수 있습니다. 오늘 데이터는 아직 집계 중입니다.")

    if unit == "week":
        start = start - datetime.timedelta(days=start.weekday())
        end = end + datetime.timedelta(days=6 - end.weekday())
        if end > yesterday:
            end -= datetime.timedelta(days=7)
    elif unit == "month":
        start = _month_start(start)
        end = _next_month(end) - ONE_DAY
        if end > yesterday:
            end = _month_start(end) - ONE_DAY
    if end < start:
        raise PeriodError(f"선택한 기간에 끝난 {LABEL[unit]} 단위 구간이 없습니다. 기간을 넓히거나 다른 단위를 고르세요.")

    w = Window(unit, start, end, f"{start.isoformat()} ~ {end.isoformat()}", custom=True)
    limit = MAX_DAYS[unit]
    if limit and w.days > limit:
        reason = {"day": "구글은 약 9개월이 넘는 기간은 일별 데이터를 주지 않습니다",
                  "week": "구글은 5년이 넘는 기간은 주별 데이터를 주지 않습니다"}[unit]
        raise PeriodError(f"{reason}. 기간을 줄이거나 더 큰 단위를 고르세요.")
    if w.points < 2:
        raise PeriodError(f"변화를 보려면 {LABEL[unit]} 단위 구간이 2개 이상 필요합니다. 기간을 넓히거나 더 작은 단위를 고르세요.")
    return w


def period_key(unit: str, date_str: str, google_weeks: bool = False) -> str:
    """The period a dated point belongs to: YYYY-MM-DD for days and weeks (the Monday), YYYY-MM for months.

    google_weeks: the point is a Google week starting on Sunday. It is filed under the Monday
    after it (week view) or under the month holding most of its days (month view).
    """
    d = datetime.date.fromisoformat(date_str[:10])
    if google_weeks:
        d += datetime.timedelta(days=1 if unit == "week" else 3)
    if unit == "month":
        return d.isoformat()[:7]
    if unit == "week":
        d -= datetime.timedelta(days=d.weekday())
    return d.isoformat()


def period_starts(w: Window) -> list:
    """Start date of every period in the window, oldest first."""
    starts, d = [], w.start
    while d <= w.end:
        starts.append(d)
        d = d + ONE_DAY if w.unit == "day" else d + datetime.timedelta(days=7) if w.unit == "week" else _next_month(d)
    return starts


def change_pct(series: list) -> float:
    """Change of the last period against the one before it, in percent."""
    if len(series) < 2:
        return 0.0
    return pct(series[-2], series[-1])


def pct(before: float, after: float) -> float:
    return round(((after - before) / max(before, 1)) * 100, 1)


def is_google_weekly(dates: list) -> bool:
    """True when Google answered with weekly points (each a Sunday, 7 days apart)."""
    if len(dates) < 2:
        return False
    a, b = (datetime.date.fromisoformat(x[:10]) for x in dates[:2])
    return (b - a).days == 7 and a.weekday() == 6


def bucket(points: list, w: Window, google_weeks: bool = False) -> list:
    """Average dated points into the window's periods; periods outside the window are dropped.

    Returns [{"date": period key, "value": average}] oldest first.
    """
    first, last = period_key(w.unit, w.start.isoformat()), period_key(w.unit, w.end.isoformat())
    groups: dict = {}
    for p in points:
        key = period_key(w.unit, p["date"], google_weeks)
        if first <= key <= last:
            groups.setdefault(key, []).append(p["value"])
    return [{"date": k, "value": round(sum(v) / len(v), 1)} for k, v in sorted(groups.items())]
