import React, { useState } from 'react';
import {
  Search,
  X,
  TrendingUp,
  Loader2,
  Sparkles,
  Download,
  AlertCircle,
  Globe,
  Youtube,
  ShoppingBag,
  Newspaper,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  GoogleTrendsSearchResponse,
} from '../types';
import { useTheme } from '../utils/useTheme';

interface GoogleTrendsStudioProps {
  onSearchGoogleTrends: (payload: {
    keywords: string[];
    timeframe: string;
    geo: string;
    gprop: string;
  }) => Promise<GoogleTrendsSearchResponse | null>;
  isLoading: boolean;
}

const GOOGLE_PALETTE = [
  '#4285F4', // 1: Google Blue
  '#EA4335', // 2: Google Red
  '#FBBC05', // 3: Google Yellow
  '#34A853', // 4: Google Green
  '#9333EA', // 5: Purple
];

const TIMEFRAME_OPTIONS = [
  { id: 'now 1-d', label: '1일 (24시간)' },
  { id: 'now 7-d', label: '7일' },
  { id: 'today 1-m', label: '1개월' },
  { id: 'today 3-m', label: '3개월' },
  { id: 'today 12-m', label: '1년 (12개월)' },
  { id: 'today 5-y', label: '5년' },
];

const GEO_OPTIONS = [
  { id: 'KR', label: '대한민국 (전체)' },
  { id: 'KR-11', label: '서울' },
  { id: 'KR-41', label: '경기도' },
  { id: '', label: '전세계 (글로벌)' },
  { id: 'US', label: '미국 (US)' },
  { id: 'JP', label: '일본 (JP)' },
];

const GPROP_OPTIONS = [
  { id: '', label: '웹 검색', icon: Globe },
  { id: 'youtube', label: '유튜브 (YouTube)', icon: Youtube },
  { id: 'froogle', label: '구글 쇼핑', icon: ShoppingBag },
  { id: 'news', label: '구글 뉴스', icon: Newspaper },
];

export const GoogleTrendsStudio: React.FC<GoogleTrendsStudioProps> = ({
  onSearchGoogleTrends,
  isLoading,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── 5 Keyword Slots ──
  const [keywordInputs, setKeywordInputs] = useState<string[]>([
    '캠핑',
    '등산',
    '골프',
    '',
    '',
  ]);

  // Filters
  const [timeframe, setTimeframe] = useState<string>('today 12-m');
  const [geo, setGeo] = useState<string>('KR');
  const [gprop, setGprop] = useState<string>('');

  // Results & Error
  const [resultData, setResultData] = useState<GoogleTrendsSearchResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleKeywordChange = (index: number, val: string) => {
    const next = [...keywordInputs];
    next[index] = val;
    setKeywordInputs(next);
  };

  const handleClearSlot = (index: number) => {
    const next = [...keywordInputs];
    next[index] = '';
    setKeywordInputs(next);
  };

  const handleSearch = async () => {
    setErrorMsg(null);
    const validKeywords = keywordInputs.map((k) => k.trim()).filter((k) => k.length > 0);
    if (validKeywords.length === 0) {
      setErrorMsg('비교 분석할 키워드를 최소 1개 이상 입력해 주세요.');
      return;
    }

    const res = await onSearchGoogleTrends({
      keywords: validKeywords,
      timeframe,
      geo,
      gprop,
    });

    if (res) {
      setResultData(res);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!resultData || !resultData.timeline || resultData.timeline.length === 0) return;

    const headers = ['기간', ...resultData.keywords];
    const rows = resultData.timeline.map((point) => {
      const vals = resultData.keywords.map((kw) => point.values[kw] ?? 0);
      return [point.period, ...vals].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `google_trends_${resultData.keywords.join('_')}_${resultData.timeframe}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Formatted chart data
  const chartData = (resultData?.timeline || []).map((point) => ({
    period: point.period,
    ...point.values,
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Studio Banner ── */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 space-y-4 dark:border-[#26272c] dark:bg-[#141416] transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-blue-50 text-[#4285F4] dark:bg-[#1a2333] shadow-inner mt-0.5">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  구글 트렌드 정밀 비교 스튜디오 (Google Trends Studio)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 text-[#4285F4] dark:bg-[#1c283d] dark:text-[#6ba3ff] border border-blue-200 dark:border-blue-800">
                  Precision Multi-Search
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AEAEAE] mt-1.5 leading-relaxed">
                최대 5개 키워드의 글로벌 및 국내 구글 검색 관심도를 동시 비교합니다. 기간(1일~5년), 지역(전세계/시도), 검색 채널(웹/유튜브/쇼핑/뉴스)을 정밀하게 타겟팅하여 분석할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* ── 5 Keyword Comparison Slots ── */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#202126]">
          {keywordInputs.map((val, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="flex items-center space-x-2 sm:w-28 flex-shrink-0">
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: GOOGLE_PALETTE[idx] }}
                />
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-[#AEAEAE]">
                  비교어 {idx + 1}
                </span>
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleKeywordChange(idx, e.target.value)}
                  placeholder={`비교할 키워드 ${idx + 1} 입력 (예: ${
                    ['캠핑', '등산', '골프', '러닝', '서핑'][idx]
                  })`}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4285F4] text-xs sm:text-sm font-medium dark:border-[#26272c] dark:bg-[#1a1b1f] dark:text-white dark:placeholder-[#646464] transition-all pr-10"
                />
                {val && (
                  <button
                    type="button"
                    onClick={() => handleClearSlot(idx)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:text-[#646464] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Search Configurations & Filters ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-[#202126]">
          {/* Timeframe selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
              <span>조회 기간 (Timeframe)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {TIMEFRAME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTimeframe(opt.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                    timeframe === opt.id
                      ? 'bg-[#4285F4] text-white border-[#4285F4] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] dark:hover:bg-[#23242b]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Region selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
              <span>지역 범위 (Region)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {GEO_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGeo(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                    geo === opt.id
                      ? 'bg-[#4285F4] text-white border-[#4285F4] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] dark:hover:bg-[#23242b]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Property (gprop) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
              <span>검색 유형 (Property)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {GPROP_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGprop(opt.id)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border ${
                      gprop === opt.id
                        ? 'bg-[#4285F4] text-white border-[#4285F4] shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] dark:hover:bg-[#23242b]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-center space-x-2.5 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-[#4285F4] hover:bg-[#3367d6] text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>구글 트렌드 데이터 수집 및 정밀 분석 중...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>구글 트렌드 정밀 비교 데이터 조회</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Search Results ── */}
      {resultData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header & Status */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 dark:border-[#26272c] dark:bg-[#141416] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#202126]">
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#4285F4]" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    키워드별 상대 검색 관심도 비교 추이
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      resultData.is_live
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#122315] dark:text-[#A8FF1A] dark:border-emerald-900/50'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#251f14] dark:text-amber-400 dark:border-amber-900/50'
                    }`}
                  >
                    {resultData.is_live ? '실시간 구글 공식 데이터' : '시뮬레이션 모드'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#AEAEAE] mt-1">
                  기간: {resultData.timeframe} · 지역: {resultData.geo || '전세계'} · 채널:{' '}
                  {resultData.gprop || '웹 검색'} · 최고 관심도 구간(100)을 기준으로 환산
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#202126] dark:text-white dark:hover:bg-[#2a2b32] transition-colors flex items-center space-x-2 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV 데이터 내보내기</span>
              </button>
            </div>

            {/* Recharts Line Chart */}
            <div className="h-80 sm:h-96 w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? '#202126' : '#e2e8f0'}
                  />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: isDark ? '#AEAEAE' : '#64748b', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: isDark ? '#AEAEAE' : '#64748b', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#141416' : '#FFFFFF',
                      borderRadius: '16px',
                      border: isDark ? '1px solid #26272c' : '1px solid #e2e8f0',
                      boxShadow: isDark
                        ? '0 12px 32px -4px rgba(0, 0, 0, 0.8)'
                        : '0 12px 24px -4px rgba(0, 0, 0, 0.12)',
                      fontSize: '12px',
                      padding: '12px 14px',
                      color: isDark ? '#FFFFFF' : '#0f172a',
                    }}
                    formatter={(val: number, name: string) => [`${val} 점`, name]}
                    labelFormatter={(label) => `기간: ${label}`}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 600 }}
                  />

                  {resultData.keywords.map((kw, idx) => (
                    <Line
                      key={kw}
                      type="monotone"
                      dataKey={kw}
                      name={kw}
                      stroke={GOOGLE_PALETTE[idx % GOOGLE_PALETTE.length]}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Key Stat Cards per Keyword ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultData.keywords.map((kw, idx) => {
              const summary = resultData.summaries[kw];
              if (!summary) return null;
              const color = GOOGLE_PALETTE[idx % GOOGLE_PALETTE.length];

              return (
                <div
                  key={kw}
                  className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 space-y-4 dark:border-[#26272c] dark:bg-[#141416] transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#202126]">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <h4 className="text-base font-black text-slate-900 dark:text-white">{kw}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-[#AEAEAE]">
                      Rank #{idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1b1f] text-center">
                      <span className="text-[10px] text-slate-500 dark:text-[#AEAEAE] block">최고점</span>
                      <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
                        {summary.peak_value}점
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1b1f] text-center">
                      <span className="text-[10px] text-slate-500 dark:text-[#AEAEAE] block">평균</span>
                      <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
                        {summary.average_value}점
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1b1f] text-center">
                      <span className="text-[10px] text-slate-500 dark:text-[#AEAEAE] block">직전 대비</span>
                      <span
                        className={`text-sm font-black mt-0.5 block ${
                          summary.change_pct > 0
                            ? 'text-emerald-600 dark:text-[#A8FF1A]'
                            : summary.change_pct < 0
                            ? 'text-red-500 dark:text-[#F34238]'
                            : 'text-slate-500'
                        }`}
                      >
                        {summary.change_pct > 0 ? `+${summary.change_pct}%` : `${summary.change_pct}%`}
                      </span>
                    </div>
                  </div>

                  {summary.peak_period && (
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#AEAEAE]">
                      <Sparkles className="w-3.5 h-3.5 text-[#FBBC05] flex-shrink-0" />
                      <span>
                        최고 관심도 기록 시점: <strong className="text-slate-800 dark:text-white">{summary.peak_period}</strong>
                      </span>
                    </div>
                  )}

                  {/* Related queries */}
                  {summary.related_queries && summary.related_queries.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-[#202126] space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-[#AEAEAE] block">
                        실시간 연관 검색어
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {summary.related_queries.map((rq, rqIdx) => (
                          <span
                            key={rqIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-[#202126] dark:text-[#AEAEAE]"
                          >
                            {rq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
