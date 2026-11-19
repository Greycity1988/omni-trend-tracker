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

/** Short axis label for a period key. */
export function formatPeriod(date: string, unit: TrendUnit): string {
  if (unit === 'month') return date.slice(0, 7);
  const [y, m, d] = date.split('-');
  // 52 weeks cross a year boundary, so week labels carry the year.
  return unit === 'week' ? `${y.slice(2)}.${Number(m)}.${Number(d)}` : `${Number(m)}/${Number(d)}`;
}

/** Full label for tooltips and the peak card. */
export function describePeriod(date: string, unit: TrendUnit): string {
  if (unit === 'month') return date.slice(0, 7);
  return unit === 'week' ? `${date} 시작 주` : date;
}
