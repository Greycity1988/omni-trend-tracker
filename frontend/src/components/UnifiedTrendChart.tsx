import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PlatformKey, PlatformMetric, TimelinePoint } from '../types';
import { Layers } from 'lucide-react';
import { useTheme } from '../utils/useTheme';

interface UnifiedTrendChartProps {
  timeline: TimelinePoint[];
  keyword: string;
  platforms: Partial<Record<PlatformKey, PlatformMetric>>;
}

export const UnifiedTrendChart: React.FC<UnifiedTrendChartProps> = ({ timeline, keyword, platforms }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeChannels, setActiveChannels] = useState<{
    naver: boolean;
    google: boolean;
    pinterest: boolean;
    meta: boolean;
  }>({
    naver: true,
    google: true,
    pinterest: true,
    meta: true,
  });

  const toggleChannel = (key: PlatformKey) => {
    setActiveChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const shown = (key: PlatformKey) => Boolean(platforms[key]) && activeChannels[key];
  const exampleTag = (key: PlatformKey) => (platforms[key]?.is_live ? '' : ' (예시)');
  const dash = (key: PlatformKey) => (platforms[key]?.is_live ? undefined : '5 4');
  const hasExample = Object.values(platforms).some((p) => p && !p.is_live);

  const formattedData = timeline.map((p) => ({
    ...p,
    displayDate: p.date.length >= 7 ? p.date.substring(0, 7) : p.date,
  }));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 space-y-6 dark:border-[#26272c] dark:bg-[#141416] transition-colors">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#202126]">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-slate-800 dark:text-white" />
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              플랫폼 통합 검색 관심도 추이
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#AEAEAE] mt-1">
            ‘{keyword}’ 키워드의 지난 12개월간 월별 관심도 (채널마다 자체 최고점을 100으로 환산)
            {hasExample && ' · 점선은 예시 데이터'}
          </p>
        </div>

        {/* Channel Toggles (Pill Buttons) */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          {platforms.naver && (
            <button
              type="button"
              onClick={() => toggleChannel('naver')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.naver
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-black" />
              <span>네이버{exampleTag('naver')}</span>
            </button>
          )}

          {platforms.google && (
            <button
              type="button"
              onClick={() => toggleChannel('google')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.google
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-[#A8FF1A] dark:text-black dark:border-[#A8FF1A] shadow-sm'
                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-200 dark:bg-black" />
              <span>구글{exampleTag('google')}</span>
            </button>
          )}

          {platforms.pinterest && (
            <button
              type="button"
              onClick={() => toggleChannel('pinterest')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.pinterest
                  ? 'bg-[#F34238] text-white font-bold border-[#F34238] shadow-sm'
                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>핀터{exampleTag('pinterest')}</span>
            </button>
          )}

          {platforms.meta && (
            <button
              type="button"
              onClick={() => toggleChannel('meta')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.meta
                  ? 'bg-purple-600 text-white border-purple-600 dark:bg-[#AEAEAE] dark:text-black dark:border-[#AEAEAE] shadow-sm'
                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#2e2f36] opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white dark:bg-black" />
              <span>인스타{exampleTag('meta')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-72 sm:h-88 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNaver" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? '#FFFFFF' : '#059669'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isDark ? '#FFFFFF' : '#059669'} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? '#A8FF1A' : '#2563EB'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isDark ? '#A8FF1A' : '#2563EB'} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F34238" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F34238" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? '#AEAEAE' : '#9333EA'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isDark ? '#AEAEAE' : '#9333EA'} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#202126' : '#e2e8f0'} />
            <XAxis
              dataKey="displayDate"
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
              formatter={(val: number, name: string) => {
                const labels: Record<string, string> = {
                  naver: '네이버 데이터랩',
                  google: '구글 트렌드',
                  pinterest: '핀터레스트',
                  meta: '인스타그램',
                };
                return [`${val} 점`, (labels[name] || name) + exampleTag(name as PlatformKey)];
              }}
              labelFormatter={(label) => `기간: ${label}`}
            />

            {shown('naver') && (
              <Area
                type="monotone"
                dataKey="naver"
                stroke={isDark ? '#FFFFFF' : '#059669'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorNaver)"
                strokeDasharray={dash('naver')}
                connectNulls
              />
            )}
            {shown('google') && (
              <Area
                type="monotone"
                dataKey="google"
                stroke={isDark ? '#A8FF1A' : '#2563EB'}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorGoogle)"
                strokeDasharray={dash('google')}
                connectNulls
              />
            )}
            {shown('pinterest') && (
              <Area
                type="monotone"
                dataKey="pinterest"
                stroke="#F34238"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPin)"
                strokeDasharray={dash('pinterest')}
                connectNulls
              />
            )}
            {shown('meta') && (
              <Area
                type="monotone"
                dataKey="meta"
                stroke={isDark ? '#AEAEAE' : '#9333EA'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMeta)"
                strokeDasharray={dash('meta')}
                connectNulls
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
