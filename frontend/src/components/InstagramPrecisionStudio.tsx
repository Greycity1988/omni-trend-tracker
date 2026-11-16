import React, { useState } from 'react';
import {
  Search,
  X,
  TrendingUp,
  Loader2,
  Download,
  AlertCircle,
  Instagram,
  Flame,
  Award,
  Key,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  MetaPrecisionSearchResponse,
} from '../types';
import { useTheme } from '../utils/useTheme';

interface InstagramPrecisionStudioProps {
  onSearchMetaPrecision: (payload: {
    keywords: string[];
    country: string;
    status: string;
    publisher_platform: string;
  }) => Promise<MetaPrecisionSearchResponse | null>;
  isLoading: boolean;
  onOpenApiModal?: () => void;
}

const META_PALETTE = [
  '#E1306C', // 1: Instagram Magenta
  '#833AB4', // 2: Instagram Purple
  '#FD1D1D', // 3: Instagram Red/Orange
  '#F56040', // 4: Instagram Coral
  '#FCAF45', // 5: Instagram Yellow
];

const COUNTRY_OPTIONS = [
  { id: 'KR', label: '대한민국 (KR)' },
  { id: 'US', label: '미국 (US)' },
  { id: 'JP', label: '일본 (JP)' },
  { id: 'ALL', label: '글로벌 전체' },
];

const STATUS_OPTIONS = [
  { id: 'ALL', label: '전체 광고 (누적)' },
  { id: 'ACTIVE', label: '현재 집행 중 (Active)' },
];

const PLATFORM_OPTIONS = [
  { id: 'INSTAGRAM', label: '인스타그램 전용' },
  { id: 'ALL', label: '인스타 + 페이스북' },
];

export const InstagramPrecisionStudio: React.FC<InstagramPrecisionStudioProps> = ({
  onSearchMetaPrecision,
  isLoading,
  onOpenApiModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── 5 Brand/Keyword Slots ──
  const [keywordInputs, setKeywordInputs] = useState<string[]>([
    '러닝화',
    '나이키',
    '아디다스',
    '뉴발란스',
    '',
  ]);

  // Filters
  const [country, setCountry] = useState<string>('KR');
  const [status, setStatus] = useState<string>('ALL');
  const [publisherPlatform, setPublisherPlatform] = useState<string>('INSTAGRAM');

  // Results & Error
  const [resultData, setResultData] = useState<MetaPrecisionSearchResponse | null>(null);
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
      setErrorMsg('비교 분석할 키워드 또는 브랜드를 최소 1개 이상 입력해 주세요.');
      return;
    }

    const res = await onSearchMetaPrecision({
      keywords: validKeywords,
      country,
      status,
      publisher_platform: publisherPlatform,
    });

    if (res) {
      setResultData(res);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!resultData || !resultData.results || resultData.results.length === 0) return;

    const headers = ['브랜드/키워드', '총 광고 캠페인 수', '광고 활동 지수', '주요 광고주 리스트'];
    const rows = resultData.results.map((item) => {
      const topAdv = item.top_advertisers.map((a) => `${a.page_name}(${a.ad_count})`).join(' | ');
      return [
        `"${item.keyword}"`,
        item.total_ads_found,
        item.activity_score,
        `"${topAdv}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `instagram_ad_intelligence_${resultData.country}_${resultData.status}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Comparison Bar Chart Data
  const comparisonBarData = (resultData?.results || []).map((r, idx) => ({
    keyword: r.keyword,
    '광고 캠페인 수': r.total_ads_found,
    '활동 지수': r.activity_score,
    fill: META_PALETTE[idx % META_PALETTE.length],
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Studio Banner ── */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 space-y-4 dark:border-[#26272c] dark:bg-[#141416] transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-pink-50 text-[#E1306C] dark:bg-[#25121b] shadow-inner mt-0.5">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  인스타그램 광고 & 브랜드 인텔리전스 (Meta Ads Studio)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-pink-100 text-[#E1306C] dark:bg-[#2e1320] dark:text-[#ff6b9d] border border-pink-200 dark:border-pink-900/50">
                  Ad Archive Intelligence
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AEAEAE] mt-1.5 leading-relaxed">
                인스타그램에서 집행되는 실시간 광고 캠페인 규모, 경쟁 브랜드의 활성 광고 수, 주요 광고주 페이지 랭킹을 심층 분석합니다. 공식 메타 광고 보관소(Meta Ads Archive) API를 통해 투명한 시장 침투도를 확인하세요.
              </p>
            </div>
          </div>
        </div>

        {/* ── 5 Brand/Keyword Slots ── */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#202126]">
          {keywordInputs.map((val, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="flex items-center space-x-2 sm:w-28 flex-shrink-0">
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: META_PALETTE[idx] }}
                />
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-[#AEAEAE]">
                  비교 대상 {idx + 1}
                </span>
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleKeywordChange(idx, e.target.value)}
                  placeholder={`비교할 브랜드 또는 키워드 ${idx + 1} 입력 (예: ${
                    ['러닝화', '나이키', '아디다스', '뉴발란스', '호카'][idx]
                  })`}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E1306C] text-xs sm:text-sm font-medium dark:border-[#26272c] dark:bg-[#1a1b1f] dark:text-white dark:placeholder-[#646464] transition-all pr-10"
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

        {/* ── Configurations & Filters ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-[#202126]">
          {/* Country selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
              <span>광고 도달 국가 (Country)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {COUNTRY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCountry(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                    country === opt.id
                      ? 'bg-[#E1306C] text-white border-[#E1306C] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] dark:hover:bg-[#23242b]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ad Status selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
              <span>광고 상태 (Status)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                    status === opt.id
                      ? 'bg-[#E1306C] text-white border-[#E1306C] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] dark:hover:bg-[#23242b]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Publisher Platform selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
              <span>게재 플랫폼 (Placements)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PLATFORM_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPublisherPlatform(opt.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                    publisherPlatform === opt.id
                      ? 'bg-[#E1306C] text-white border-[#E1306C] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] dark:hover:bg-[#23242b]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
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
            className="w-full py-4 rounded-2xl bg-[#E1306C] hover:bg-[#c9245d] text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-lg shadow-pink-500/25 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>메타 인스타그램 광고 데이터 수집 및 분석 중...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>인스타그램 광고·캠페인 인텔리전스 조회</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Search Results ── */}
      {resultData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Notice banner if token expired or needs update */}
          {resultData.notice && (
            <div className="p-4 sm:p-5 rounded-3xl border border-amber-300 bg-amber-50 dark:border-amber-800/50 dark:bg-[#251d14] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="font-bold">안내: </span>
                  <span>{resultData.notice}</span>
                </div>
              </div>
              {onOpenApiModal && (
                <button
                  type="button"
                  onClick={onOpenApiModal}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>API 키 갱신</span>
                </button>
              )}
            </div>
          )}

          {/* Volume Comparison Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 dark:border-[#26272c] dark:bg-[#141416] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#202126]">
              <div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-[#E1306C]" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    키워드·브랜드별 광고 캠페인 규모 및 활동 지수 비교
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      resultData.is_live
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#122315] dark:text-[#A8FF1A] dark:border-emerald-900/50'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#251f14] dark:text-amber-400 dark:border-amber-900/50'
                    }`}
                  >
                    {resultData.is_live ? '실시간 Meta Ads 연동' : '정밀 시뮬레이션 모드'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#AEAEAE] mt-1">
                  국가: {resultData.country} · 상태: {resultData.status} · 플랫폼: 인스타그램
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

            {/* Recharts Bar Chart */}
            <div className="h-72 sm:h-88 w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? '#202126' : '#e2e8f0'}
                  />
                  <XAxis
                    dataKey="keyword"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: isDark ? '#AEAEAE' : '#64748b', fontSize: 12, fontWeight: 700 }}
                  />
                  <YAxis
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
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 600 }} />
                  <Bar dataKey="광고 캠페인 수" fill="#E1306C" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="활동 지수" fill="#833AB4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Brand Competitor Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resultData.results.map((item, idx) => {
              const color = META_PALETTE[idx % META_PALETTE.length];

              return (
                <div
                  key={item.keyword}
                  className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-7 space-y-5 dark:border-[#26272c] dark:bg-[#141416] transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#202126]">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {item.keyword}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-pink-50 text-[#E1306C] dark:bg-[#25121b] dark:text-[#ff6b9d]">
                        지수 {item.activity_score}점
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1b1f]">
                      <span className="text-[11px] text-slate-500 dark:text-[#AEAEAE] block">
                        수집된 광고 캠페인
                      </span>
                      <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                        {item.total_ads_found.toLocaleString()}건
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1b1f]">
                      <span className="text-[11px] text-slate-500 dark:text-[#AEAEAE] block">
                        확인된 활성 광고주
                      </span>
                      <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                        {item.top_advertisers.length}개사
                      </span>
                    </div>
                  </div>

                  {/* Monthly delivery curve */}
                  {item.timeline && item.timeline.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#E1306C]" />
                        <span>월별 광고 릴리즈 추이 (지난 12개월)</span>
                      </span>
                      <div className="h-28 w-full pt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={item.timeline} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`gradMeta_${idx}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="period"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: isDark ? '#AEAEAE' : '#64748b', fontSize: 10 }}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: isDark ? '#AEAEAE' : '#64748b', fontSize: 10 }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDark ? '#141416' : '#FFFFFF',
                                borderRadius: '12px',
                                border: isDark ? '1px solid #26272c' : '1px solid #e2e8f0',
                                fontSize: '11px',
                                padding: '8px 10px',
                                color: isDark ? '#FFFFFF' : '#0f172a',
                              }}
                              formatter={(v: number) => [`${v}건`, '집행 광고 수']}
                            />
                            <Area
                              type="monotone"
                              dataKey="count"
                              stroke={color}
                              strokeWidth={2}
                              fillOpacity={1}
                              fill={`url(#gradMeta_${idx})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Top Advertisers Ranking */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#202126]">
                    <span className="text-xs font-bold text-slate-700 dark:text-[#AEAEAE] flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>주요 광고주 (페이지 랭킹)</span>
                    </span>
                    <div className="space-y-1.5">
                      {item.top_advertisers.slice(0, 5).map((adv, aIdx) => (
                        <div
                          key={aIdx}
                          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1b1f] text-xs font-medium"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="w-4 text-[10px] font-bold text-slate-400 dark:text-[#AEAEAE]">
                              #{aIdx + 1}
                            </span>
                            <span className="text-slate-900 dark:text-white font-bold truncate">
                              {adv.page_name}
                            </span>
                          </div>
                          <span className="text-[#E1306C] font-mono font-bold flex-shrink-0 ml-2">
                            {adv.ad_count}건
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
