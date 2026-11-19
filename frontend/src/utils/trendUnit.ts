import { TrendUnit } from '../types';

export const UNIT_OPTIONS: { id: TrendUnit; label: string; hint: string }[] = [
  { id: 'day', label: '일', hint: '최근 30일' },
  { id: 'week', label: '주', hint: '최근 52주' },
  { id: 'month', label: '월', hint: '최근 12개월' },
];

export const UNIT_TEXT: Record<TrendUnit, { span: string; each: string; peakTitle: string }> = {
  day: { span: '최근 30일', each: '일별', peakTitle: 'PEAK DAY' },
  week: { span: '최근 52주', each: '주별', peakTitle: 'PEAK WEEK' },
  month: { span: '최근 12개월', each: '월별', peakTitle: 'PEAK MONTH' },
};

/** A range the user picked (YYYY-MM-DD, both ends included). */
export interface DateRange {
  start: string;
  end: string;
}

/** Same limits as the backend (backend/app/services/periods.py). */
export const EARLIEST_DATE = '2016-01-01';
const MAX_DAYS: Record<TrendUnit, number | null> = { day: 270, week: 5 * 365 + 1, month: null };

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toIso(d);
}

export function daysBetween(start: string, end: string): number {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000) + 1;
}

/** Why a unit cannot be used for this range, or null when it can. The server has the last word. */
export function unitBlockedReason(unit: TrendUnit, range: DateRange | null): string | null {
  if (!range) return null;
  const max = MAX_DAYS[unit];
  if (max && daysBetween(range.start, range.end) > max) {
    return unit === 'day'
      ? '구글은 약 9개월이 넘는 기간은 일별 데이터를 주지 않습니다'
      : '구글은 5년이 넘는 기간은 주별 데이터를 주지 않습니다';
  }
  return null;
}

/** Problem with the dates themselves, or null. */
export function rangeProblem(range: DateRange): string | null {
  if (!range.start || !range.end) return '시작일과 종료일을 모두 골라 주세요.';
  if (range.start > range.end) return '시작일이 종료일보다 늦습니다.';
  if (range.start < EARLIEST_DATE) return '2016-01-01부터 조회할 수 있습니다.';
  if (range.end > yesterdayIso()) return '종료일은 어제까지 고를 수 있습니다.';
  return null;
}

/** The smallest unit the range allows: day if it fits, then week, then month. */
export function bestUnitFor(range: DateRange, wanted: TrendUnit): TrendUnit {
  if (!unitBlockedReason(wanted, range)) return wanted;
  return (['day', 'week', 'month'] as TrendUnit[]).find((u) => !unitBlockedReason(u, range)) ?? 'month';
}

export function rangePresets(): { label: string; range: DateRange }[] {
  const end = yesterdayIso();
  const back = (months: number) => {
    const [y, m, day] = end.split('-').map(Number);
    const d = new Date(y, m - 1, day); // local date, not UTC midnight
    d.setMonth(d.getMonth() - months);
    d.setDate(d.getDate() + 1);
    return toIso(d);
  };
  const lastYear = new Date().getFullYear() - 1;
  return [
    { label: '최근 3개월', range: { start: back(3), end } },
    { label: '최근 6개월', range: { start: back(6), end } },
    { label: '최근 1년', range: { start: back(12), end } },
    { label: `${lastYear}년`, range: { start: `${lastYear}-01-01`, end: `${lastYear}-12-31` } },
    { label: '최근 3년', range: { start: back(36), end } },
  ];
}

/** Short axis label for a period key. withYear: the data spans more than one year. */
export function formatPeriod(date: string, unit: TrendUnit, withYear = false): string {
  if (unit === 'month') return date.slice(0, 7);
  const [y, m, d] = date.split('-');
  // 52 weeks cross a year boundary, so week labels always carry the year.
  if (unit === 'week' || withYear) return `${y.slice(2)}.${Number(m)}.${Number(d)}`;
  return `${Number(m)}/${Number(d)}`;
}

/** Full label for tooltips and the peak card. */
export function describePeriod(date: string, unit: TrendUnit): string {
  if (unit === 'month') return date.slice(0, 7);
  return unit === 'week' ? `${date} 시작 주` : date;
}
