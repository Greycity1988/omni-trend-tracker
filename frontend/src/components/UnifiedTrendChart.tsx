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

interface UnifiedTrendChartProps {
  timeline: TimelinePoint[];
  keyword: string;
  platforms: Partial<Record<PlatformKey, PlatformMetric>>;
}

export const UnifiedTrendChart: React.FC<UnifiedTrendChartProps> = ({ timeline, keyword, platforms }) => {
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

  // A channel is drawn only when the backend reports it; example data is marked and dashed
  const shown = (key: PlatformKey) => Boolean(platforms[key]) && activeChannels[key];
  const exampleTag = (key: PlatformKey) => (platforms[key]?.is_live ? '' : ' (예시)');
  const dash = (key: PlatformKey) => (platforms[key]?.is_live ? undefined : '5 4');
  const hasExample = Object.values(platforms).some((p) => p && !p.is_live);

  const formattedData = timeline.map((p) => ({
    ...p,
    displayDate: p.date.length >= 7 ? p.date.substring(0, 7) : p.date,
  }));

  return (
    <div className="bg-surface rounded-3xl border border-line shadow-soft-sm p-6 sm:p-8 space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line/60">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold tracking-tight text-ink-primary">
              플랫폼 통합 검색 관심도 추이
            </h3>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            ‘{keyword}’ 키워드의 지난 12개월간 월별 관심도 (채널마다 자체 최고점을 100으로 환산)
            {hasExample && ' · 점선은 예시 데이터'}
          </p>
        </div>

        {/* Channel Toggles */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          {platforms.naver && (
            <button
              type="button"
              onClick={() => toggleChannel('naver')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.naver
                  ? 'bg-[#03C75A]/10 text-[#03C75A] border-[#03C75A]/30 font-bold'
                  : 'bg-canvas-subtle text-ink-muted border-line opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#03C75A]" />
              <span>네이버 데이터랩{exampleTag('naver')}</span>
            </button>
          )}

          {platforms.google && (
            <button
              type="button"
              onClick={() => toggleChannel('google')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.google
                  ? 'bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30 font-bold'
                  : 'bg-canvas-subtle text-ink-muted border-line opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span>구글 트렌드{exampleTag('google')}</span>
            </button>
          )}

          {platforms.pinterest && (
            <button
              type="button"
              onClick={() => toggleChannel('pinterest')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.pinterest
                  ? 'bg-[#E60023]/10 text-[#E60023] border-[#E60023]/30 font-bold'
                  : 'bg-canvas-subtle text-ink-muted border-line opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#E60023]" />
              <span>핀터레스트{exampleTag('pinterest')}</span>
            </button>
          )}

          {platforms.meta && (
            <button
              type="button"
              onClick={() => toggleChannel('meta')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                activeChannels.meta
                  ? 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/30 font-bold'
                  : 'bg-canvas-subtle text-ink-muted border-line opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#E1306C]" />
              <span>인스타그램{exampleTag('meta')}</span>
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
                <stop offset="5%" stopColor="#03C75A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#03C75A" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4285F4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E60023" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E60023" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E1306C" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E1306C" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E4" />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#7E8B85', fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#7E8B85', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8E8E4',
                boxShadow: '0 8px 18px -3px rgba(17, 24, 21, 0.08)',
                fontSize: '12px',
                padding: '12px 14px',
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
                stroke="#03C75A"
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
                stroke="#4285F4"
                strokeWidth={2.5}
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
                stroke="#E60023"
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
                stroke="#E1306C"
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
