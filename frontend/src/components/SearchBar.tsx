import React, { useState } from 'react';
import { Search, Loader2, Sparkles, TrendingUp, CalendarRange, X } from 'lucide-react';
import { TrendUnit } from '../types';
import {
  DateRange,
  EARLIEST_DATE,
  UNIT_OPTIONS,
  bestUnitFor,
  daysBetween,
  rangePresets,
  rangeProblem,
  unitBlockedReason,
  yesterdayIso,
} from '../utils/trendUnit';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
  currentKeyword: string;
  unit: TrendUnit;
  /** null: the preset window for the unit */
  range: DateRange | null;
  onPeriodChange: (unit: TrendUnit, range: DateRange | null) => void;
}

const POPULAR_KEYWORDS = [
  '선크림',
  '러닝화',
  '린넨셔츠',
  '캠핑의자',
  '오마카세',
  '단백질보충제',
  '기능성베개',
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, currentKeyword, unit, range, onPeriodChange }) => {
  const [inputVal, setInputVal] = useState(currentKeyword);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(() => range ?? rangePresets()[1].range);
  const draftProblem = rangeProblem(draft);

  const applyRange = (next: DateRange) => {
    setDraft(next);
    if (rangeProblem(next)) return;
    setPickerOpen(false);
    // A long range cannot be daily (Google): fall back to the smallest unit that fits.
    onPeriodChange(bestUnitFor(next, unit), next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleChipClick = (kw: string) => {
    setInputVal(kw);
    onSearch(kw);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 space-y-5 transition-all dark:border-[#26272c] dark:bg-[#141416]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800 dark:bg-[#202126] dark:border-[#2e2f36] dark:text-[#A8FF1A] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A8FF1A]" />
            <span>NAVER × GOOGLE SEARCH TREND INTELLIGENCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            분석할 키워드를 입력하세요
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AEAEAE] mt-1">
            네이버 데이터랩과 구글 트렌드의 검색 관심도를 일·주·월 단위로 한 번에 비교 분석합니다.
          </p>
        </div>

        {/* Period: day / week / month, over the preset window or a chosen range */}
        <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div role="radiogroup" aria-label="보기 단위" className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200 dark:bg-[#1a1b1f] dark:border-[#2e2f36]">
              {UNIT_OPTIONS.map((opt) => {
                const blocked = unitBlockedReason(opt.id, range);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={unit === opt.id}
                    title={blocked ?? undefined}
                    onClick={() => unit !== opt.id && onPeriodChange(opt.id, range)}
                    disabled={isLoading || Boolean(blocked)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                      unit === opt.id
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-black'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#AEAEAE] dark:hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              aria-expanded={pickerOpen}
              disabled={isLoading}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer disabled:cursor-wait ${
                range
                  ? 'bg-[#A8FF1A] text-black border-transparent'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] dark:hover:text-white'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>기간 직접 선택</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-[#AEAEAE] flex items-center gap-1.5">
            {range ? (
              <>
                <span>선택 기간 {range.start} ~ {range.end}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPickerOpen(false);
                    onPeriodChange(unit, null);
                  }}
                  disabled={isLoading}
                  aria-label="선택 기간 해제"
                  className="inline-flex items-center rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-[#2e2f36] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <span>{UNIT_OPTIONS.find((o) => o.id === unit)?.hint}</span>
            )}
            <span>· 끝난 기간만 집계</span>
          </span>
        </div>
      </div>

      {/* Range picker */}
      {pickerOpen && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 dark:border-[#2e2f36] dark:bg-[#1a1b1f]">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-600 dark:text-[#AEAEAE]">
              시작일
              <input
                type="date"
                value={draft.start}
                min={EARLIEST_DATE}
                max={yesterdayIso()}
                onChange={(e) => setDraft({ ...draft, start: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 dark:border-[#2e2f36] dark:bg-[#141416] dark:text-white dark:[color-scheme:dark]"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-bold text-slate-600 dark:text-[#AEAEAE]">
              종료일
              <input
                type="date"
                value={draft.end}
                min={EARLIEST_DATE}
                max={yesterdayIso()}
                onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 dark:border-[#2e2f36] dark:bg-[#141416] dark:text-white dark:[color-scheme:dark]"
              />
            </label>
            <button
              type="button"
              onClick={() => applyRange(draft)}
              disabled={Boolean(draftProblem) || isLoading}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer dark:bg-white dark:text-black dark:hover:bg-slate-200"
            >
              이 기간으로 보기
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#AEAEAE] mr-1">빠른 선택</span>
            {rangePresets().map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyRange(p.range)}
                disabled={isLoading}
                className="px-3 py-1 rounded-full text-[11px] font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer dark:border-[#2e2f36] dark:bg-[#141416] dark:text-[#AEAEAE] dark:hover:text-white"
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className={`text-[11px] ${draftProblem ? 'text-rose-600 dark:text-[#F34238]' : 'text-slate-500 dark:text-[#AEAEAE]'}`}>
            {draftProblem ??
              `${daysBetween(draft.start, draft.end)}일. 주 단위는 월~일, 월 단위는 1일~말일로 맞추고 아직 끝나지 않은 구간은 뺍니다. ` +
                (unitBlockedReason('week', draft) ? '5년이 넘어 월 단위만 쓸 수 있습니다.' : unitBlockedReason('day', draft) ? '9개월이 넘어 일 단위는 쓸 수 없습니다.' : '일·주·월 모두 쓸 수 있습니다.')}
          </p>
        </div>
      )}

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-[#AEAEAE]" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="키워드 입력 (예: 선크림, 러닝화, 린넨셔츠...)"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-full border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:border-emerald-600 dark:border-[#2e2f36] dark:bg-[#1a1b1f] dark:text-white dark:placeholder:text-[#6E6E6E] dark:focus:border-[#A8FF1A] transition-all shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="ml-2.5 sm:ml-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] text-black font-black text-sm tracking-tight transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2 flex-shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>수집 중...</span>
            </>
          ) : (
            <>
              <span>트렌드 통합 분석</span>
              <TrendingUp className="w-4 h-4 text-black" />
            </>
          )}
        </button>
      </form>

      {/* Quick Recommendation Chips */}
      <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs">
        <span className="text-slate-500 dark:text-[#AEAEAE] font-mono font-bold flex-shrink-0 text-[11px] uppercase tracking-wider">
          추천 키워드:
        </span>
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleChipClick(kw)}
              disabled={isLoading}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                inputVal === kw
                  ? 'bg-[#A8FF1A] text-black font-black border-transparent shadow-[0_0_8px_rgba(168,255,26,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 dark:bg-[#1a1b1f] dark:hover:bg-[#202126] dark:text-[#AEAEAE] dark:hover:text-white dark:border-[#2e2f36]'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
