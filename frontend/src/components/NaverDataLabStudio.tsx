import React, { useState } from 'react';
import {
  Search,
  X,
  TrendingUp,
  Loader2,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
} from 'lucide-react';
import { changeText, changeTone } from '../utils/change';
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
  DataLabKeywordGroupInput,
  DataLabSearchResponse,
} from '../types';
import { useTheme } from '../utils/useTheme';
import { EARLIEST_DATE, yesterdayIso } from '../utils/trendUnit';

interface NaverDataLabStudioProps {
  onSearchDataLab: (payload: {
    start_date: string;
    end_date: string;
    time_unit: 'date' | 'week' | 'month';
    keyword_groups: { group_name: string; keywords: string[] }[];
    device?: string;
    gender?: string;
    ages?: string[];
  }) => Promise<DataLabSearchResponse | null>;
  isLoading: boolean;
}

const TOPIC_COLORS = [
  '#03C75A', // 1: Naver Green
  '#2563EB', // 2: Blue
  '#9333EA', // 3: Purple
  '#F97316', // 4: Orange
  '#EF4444', // 5: Red
];

const AGE_OPTIONS = [
  { id: '1', label: '~12' },
  { id: '2', label: '13~18' },
  { id: '3', label: '19~24' },
  { id: '4', label: '25~29' },
  { id: '5', label: '30~34' },
  { id: '6', label: '35~39' },
  { id: '7', label: '40~44' },
  { id: '8', label: '45~49' },
  { id: '9', label: '50~54' },
  { id: '10', label: '55~59' },
  { id: '11', label: '60~' },
];

export const NaverDataLabStudio: React.FC<NaverDataLabStudioProps> = ({
  onSearchDataLab,
  isLoading,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── 5 Topic Slots ──
  const [groups, setGroups] = useState<DataLabKeywordGroupInput[]>([
    { id: '1', groupName: '캠핑', keywordsString: '캠핑, Camping, 글램핑, 캠핑용품, 텐트' },
    { id: '2', groupName: '등산', keywordsString: '등산, 등산화, 트레킹, 하이킹, 등산복' },
    { id: '3', groupName: '', keywordsString: '' },
    { id: '4', groupName: '', keywordsString: '' },
    { id: '5', groupName: '', keywordsString: '' },
  ]);

  // ── Period & Filter States ──
  const [periodPreset, setPeriodPreset] = useState<'1m' | '3m' | '1y' | 'custom'>('1y');
  const [timeUnit, setTimeUnit] = useState<'date' | 'week' | 'month'>('month');

  // Dates
  // Local dates (toISOString is UTC and is a day behind in Korea before 9 a.m.). The range ends
  // yesterday: today's numbers are not complete yet.
  const yesterday = yesterdayIso();
  const monthsBefore = (months: number) => {
    const [y, m, d] = yesterday.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setMonth(date.getMonth() - months);
    date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const [startDate, setStartDate] = useState<string>(() => monthsBefore(12));
  const [endDate, setEndDate] = useState<string>(yesterday);

  // Filters
  const [device, setDevice] = useState<'all' | 'mo' | 'pc'>('all');
  const [gender, setGender] = useState<'all' | 'f' | 'm'>('all');
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [isAllAges, setIsAllAges] = useState<boolean>(true);

  // Results & Errors
  const [resultData, setResultData] = useState<DataLabSearchResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Preset Changes
  const applyPreset = (preset: '1m' | '3m' | '1y' | 'custom') => {
    setPeriodPreset(preset);
    let startStr = monthsBefore(12);

    if (preset === '1m') {
      startStr = monthsBefore(1);
      setTimeUnit('date');
    } else if (preset === '3m') {
      startStr = monthsBefore(3);
      setTimeUnit('week');
    } else if (preset === '1y') {
      startStr = monthsBefore(12);
      setTimeUnit('month');
    }

    setStartDate(startStr);
    setEndDate(yesterday);
  };

  // Group Input Handlers
  const handleGroupNameChange = (id: string, val: string) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, groupName: val } : g)));
  };

  const handleKeywordsChange = (id: string, val: string) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, keywordsString: val } : g)));
  };

  const handleClearGroup = (id: string) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, groupName: '', keywordsString: '' } : g)));
  };

  // Age Checkbox Handlers
  const toggleAge = (ageId: string) => {
    if (isAllAges) {
      setIsAllAges(false);
      setSelectedAges([ageId]);
      return;
    }
    setSelectedAges((prev) =>
      prev.includes(ageId) ? prev.filter((a) => a !== ageId) : [...prev, ageId]
    );
  };

  const toggleAllAges = () => {
    setIsAllAges(true);
    setSelectedAges([]);
  };

  // Submit Handler
  const handleQuery = async () => {
    setErrorMsg(null);
    const validGroups = groups
      .filter((g) => g.groupName.trim() && g.keywordsString.trim())
      .map((g) => ({
        group_name: g.groupName.trim(),
        keywords: g.keywordsString
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
      }));

    if (validGroups.length === 0) {
      setErrorMsg('최소 1개 이상의 주제어와 검색어를 입력해 주세요.');
      return;
    }

    const payload = {
      start_date: startDate,
      end_date: endDate,
      time_unit: timeUnit,
      keyword_groups: validGroups,
      device: device === 'all' ? undefined : device,
      gender: gender === 'all' ? undefined : gender,
      ages: isAllAges ? undefined : selectedAges,
    };

    const res = await onSearchDataLab(payload);
    if (res) {
      setResultData(res);
    }
  };

  // Load Example Template
  const loadExampleTemplate = () => {
    setGroups([
      { id: '1', groupName: '캠핑', keywordsString: '캠핑, Camping, 글램핑, 캠핑용품, 텐트' },
      { id: '2', groupName: '등산', keywordsString: '등산, 등산화, 트레킹, 하이킹, 등산복' },
      { id: '3', groupName: '골프', keywordsString: '골프, 골프웨어, 스크린골프, 골프클럽' },
      { id: '4', groupName: '러닝', keywordsString: '러닝, 마라톤, 러닝화, 조깅, 러닝웨어' },
      { id: '5', groupName: '', keywordsString: '' },
    ]);
    applyPreset('1y');
  };

  // Format chart timeline
  const chartData = React.useMemo(() => {
    if (!resultData || !resultData.results.length) return [];
    const dateMap = new Map<string, Record<string, number | string>>();

    resultData.results.forEach((group) => {
      group.data.forEach((pt) => {
        const existing = dateMap.get(pt.period) || { period: pt.period };
        existing[group.title] = pt.ratio;
        dateMap.set(pt.period, existing);
      });
    });

    return Array.from(dateMap.values()).sort((a, b) =>
      String(a.period).localeCompare(String(b.period))
    );
  }, [resultData]);

  // Download CSV
  const handleExportCSV = () => {
    if (!resultData || !chartData.length) return;
    const titles = resultData.results.map((r) => r.title);
    const header = ['기간', ...titles].join(',');
    const rows = chartData.map((row) =>
      [row.period, ...titles.map((t) => row[t] ?? '')].join(',')
    );
    const csvContent = '\uFEFF' + [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naver_datalab_${resultData.start_date}_${resultData.end_date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Naver DataLab Official Banner Header ── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-[#26272c] dark:bg-[#141416] transition-colors">
        <div className="flex items-start space-x-3.5 pb-5 border-b border-slate-100 dark:border-[#202126]">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#03C75A] border border-emerald-200 flex items-center justify-center flex-shrink-0 dark:bg-[#202126] dark:border-[#2e2f36] dark:text-[#A8FF1A]">
            <Search className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              네이버에서 얼마나 많이 검색되는지 궁금한 주제가 있으신가요? 네이버 검색데이터를 직접 조회해 보세요!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AEAEAE] leading-relaxed">
              궁금한 주제어를 설정하고, 하위 주제어에 해당하는 검색어를 콤마(,)로 구분해 입력해 주세요. 입력한 단어의 추이를 하나로 합산하여 해당 주제가 네이버에서 얼마나 검색되는지 관련 데이터를 제공합니다.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={loadExampleTemplate}
                className="text-xs font-semibold text-emerald-700 dark:text-[#A8FF1A] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>예) 주제어 캠핑: 캠핑, Camping, 캠핑용품, 겨울캠핑, 캠핑장, 글램핑, 오토캠핑 (클릭하여 템플릿 불러오기)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Subject Input Rows (주제어 1 ~ 주제어 5) ── */}
        <div className="pt-6 space-y-4">
          {groups.map((group, index) => {
            const color = TOPIC_COLORS[index];
            return (
              <div
                key={group.id}
                className="flex flex-col md:flex-row md:items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 dark:border-[#26272c] dark:bg-[#1a1b1f]/60 transition-all"
              >
                {/* Topic Label Badge */}
                <div className="flex items-center space-x-2 md:w-28 flex-shrink-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    주제어{index + 1}
                  </span>
                </div>

                {/* Topic Name Input */}
                <div className="relative md:w-64 flex-shrink-0">
                  <input
                    type="text"
                    value={group.groupName}
                    onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                    placeholder={`주제어 ${index + 1} 입력`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#03C75A] dark:border-[#2e2f36] dark:bg-[#141416] dark:text-white dark:placeholder:text-[#6E6E6E] dark:focus:border-[#A8FF1A] transition-colors pr-8"
                  />
                  {group.groupName && (
                    <button
                      type="button"
                      onClick={() => handleGroupNameChange(group.id, '')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#6E6E6E] dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sub-keywords Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={group.keywordsString}
                    onChange={(e) => handleKeywordsChange(group.id, e.target.value)}
                    placeholder={`주제어 ${index + 1}에 해당하는 모든 검색어를 콤마(,)로 구분하여 최대 20개까지 입력`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#03C75A] dark:border-[#2e2f36] dark:bg-[#141416] dark:text-white dark:placeholder:text-[#6E6E6E] dark:focus:border-[#A8FF1A] transition-colors pr-8"
                  />
                  {group.keywordsString && (
                    <button
                      type="button"
                      onClick={() => handleClearGroup(group.id)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#6E6E6E] dark:hover:text-white"
                      title="비우기"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Filters: Period, Device, Gender, Ages ── */}
        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#202126] space-y-5 text-xs sm:text-sm">
          {/* Period Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-white sm:w-20 flex-shrink-0">
              기간
            </span>
            <div className="flex items-center flex-wrap gap-2">
              {(['1m', '3m', '1y', 'custom'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    periodPreset === preset
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm dark:bg-[#03C75A] dark:border-[#03C75A]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36]'
                  }`}
                >
                  {preset === '1m' && '1개월'}
                  {preset === '3m' && '3개월'}
                  {preset === '1y' && '1년'}
                  {preset === 'custom' && '직접입력'}
                </button>
              ))}

              {/* Time Unit Selector */}
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as 'date' | 'week' | 'month')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-semibold dark:border-[#2e2f36] dark:bg-[#1a1b1f] dark:text-white cursor-pointer"
              >
                <option value="date">일간</option>
                <option value="week">주간</option>
                <option value="month">월간</option>
              </select>

              {/* Date Pickers */}
              <div className="flex items-center space-x-1.5 font-mono text-xs">
                <input
                  type="date"
                  value={startDate}
                  min={EARLIEST_DATE}
                  max={yesterday}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPeriodPreset('custom');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 dark:border-[#2e2f36] dark:bg-[#1a1b1f] dark:text-white"
                />
                <span>~</span>
                <input
                  type="date"
                  value={endDate}
                  min={EARLIEST_DATE}
                  max={yesterday}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPeriodPreset('custom');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 dark:border-[#2e2f36] dark:bg-[#1a1b1f] dark:text-white"
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-[#AEAEAE] sm:ml-auto">
              · 2016년 1월 이후 조회할 수 있습니다.
            </span>
          </div>

          {/* Device Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-white sm:w-20 flex-shrink-0">
              범위
            </span>
            <div className="flex items-center space-x-4">
              {[
                { id: 'all', label: '전체' },
                { id: 'mo', label: '모바일' },
                { id: 'pc', label: 'PC' },
              ].map((opt) => (
                <label key={opt.id} className="inline-flex items-center space-x-1.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-[#AEAEAE]">
                  <input
                    type="radio"
                    name="device"
                    value={opt.id}
                    checked={device === opt.id}
                    onChange={() => setDevice(opt.id as 'all' | 'mo' | 'pc')}
                    className="accent-emerald-600 dark:accent-[#03C75A] w-4 h-4 cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-white sm:w-20 flex-shrink-0">
              성별
            </span>
            <div className="flex items-center space-x-4">
              {[
                { id: 'all', label: '전체' },
                { id: 'f', label: '여성' },
                { id: 'm', label: '남성' },
              ].map((opt) => (
                <label key={opt.id} className="inline-flex items-center space-x-1.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-[#AEAEAE]">
                  <input
                    type="radio"
                    name="gender"
                    value={opt.id}
                    checked={gender === opt.id}
                    onChange={() => setGender(opt.id as 'all' | 'f' | 'm')}
                    className="accent-emerald-600 dark:accent-[#03C75A] w-4 h-4 cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Age Selection Row */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <span className="font-bold text-slate-800 dark:text-white sm:w-20 flex-shrink-0 pt-0.5">
              연령선택
            </span>
            <div className="flex items-center flex-wrap gap-2.5">
              <label className="inline-flex items-center space-x-1.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-[#AEAEAE] mr-2">
                <input
                  type="checkbox"
                  checked={isAllAges}
                  onChange={toggleAllAges}
                  className="accent-emerald-600 dark:accent-[#03C75A] w-4 h-4 rounded cursor-pointer"
                />
                <span className="font-bold">전체</span>
              </label>

              {AGE_OPTIONS.map((opt) => (
                <label key={opt.id} className="inline-flex items-center space-x-1 cursor-pointer text-xs text-slate-700 dark:text-[#AEAEAE]">
                  <input
                    type="checkbox"
                    checked={!isAllAges && selectedAges.includes(opt.id)}
                    onChange={() => toggleAge(opt.id)}
                    className="accent-emerald-600 dark:accent-[#03C75A] w-3.5 h-3.5 rounded cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {errorMsg && (
          <div className="mt-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-500/30 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── Center Green Action Button ── */}
        <div className="pt-8 flex justify-center">
          <button
            type="button"
            onClick={handleQuery}
            disabled={isLoading}
            className="px-10 py-3.5 rounded-full bg-[#03C75A] hover:bg-[#02b350] text-white font-extrabold text-sm sm:text-base tracking-tight transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>네이버 데이터랩 API 통신 중...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span>네이버 검색 데이터 조회</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Results Workspace Panel ── */}
      {resultData && resultData.results.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-[#26272c] dark:bg-[#141416] space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#202126]">
            <div>
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-600 dark:text-[#A8FF1A]" />
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  네이버 검색 트렌드 비교 리포트
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#03C75A] text-white shadow-sm">
                  {resultData.is_live ? 'LIVE DATALAB' : '예시 데이터 · 실제 아님'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#AEAEAE] mt-1">
                기간: {resultData.start_date} ~ {resultData.end_date} ({resultData.time_unit === 'date' ? '일간' : resultData.time_unit === 'week' ? '주간' : '월간'} 집계) · 최대 검색량 주제어의 최고점을 100으로 환산한 상대 지수
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:text-white border border-slate-200 dark:border-[#2e2f36] transition cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>CSV 다운로드</span>
            </button>
          </div>

          {/* Multi-Line Chart Container */}
          <div className="h-80 sm:h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#202126' : '#e2e8f0'} />
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
                  labelFormatter={(label) => `시점: ${label}`}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                />
                {resultData.results.map((r, idx) => (
                  <Line
                    key={r.title}
                    type="monotone"
                    dataKey={r.title}
                    name={r.title}
                    stroke={TOPIC_COLORS[idx % TOPIC_COLORS.length]}
                    strokeWidth={2.8}
                    dot={{ r: chartData.length <= 15 ? 4 : 0 }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Topic Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-[#202126]">
            {resultData.results.map((group, idx) => {
              const color = TOPIC_COLORS[idx % TOPIC_COLORS.length];
              return (
                <div
                  key={group.title}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#1a1b1f] space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {group.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-[#AEAEAE]">
                      최신: {group.latest_ratio ?? 0}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#141416] border border-slate-200 dark:border-[#2e2f36]">
                      <span className="text-[10px] text-slate-500 dark:text-[#AEAEAE] block font-mono">
                        최고점 (Peak)
                      </span>
                      <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        {group.peak_ratio ?? 0}점
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {group.peak_period}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#141416] border border-slate-200 dark:border-[#2e2f36]">
                      <span className="text-[10px] text-slate-500 dark:text-[#AEAEAE] block font-mono">
                        직전 구간 대비
                      </span>
                      <span
                        className={`font-mono font-black text-sm ${
                          changeTone(group.change_pct) === 'none'
                            ? 'text-slate-500 dark:text-[#AEAEAE]'
                            : (group.change_pct ?? 0) >= 0 ? 'text-emerald-600 dark:text-[#A8FF1A]' : 'text-rose-600 dark:text-[#F34238]'
                        }`}
                      >
                        {changeText(group.change_pct)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        변동 모멘텀
                      </span>
                    </div>
                  </div>

                  {/* Sub-keywords Tag List */}
                  <div className="flex items-center flex-wrap gap-1 pt-1">
                    {group.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-white border border-slate-200 text-slate-700 dark:bg-[#202126] dark:border-[#2e2f36] dark:text-[#AEAEAE]"
                      >
                        {kw}
                      </span>
                    ))}
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
