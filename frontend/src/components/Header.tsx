import React from 'react';
import {
  ExternalLink,
  BookOpen,
  MessageSquare,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { OTTLogo } from './OTTLogo';
import { ACV_URL } from '../constants/links';

interface HeaderProps {
  onOpenGuide?: () => void;
  onOpenFeedback?: () => void;
  onOpenDonation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenFeedback,
  onOpenDonation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* ── Left Column: Brand Logo & Title ── */}
        <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-shrink-0">
          <div className="p-1.5 rounded-2xl bg-white hover:bg-neutral-50 border border-black/[0.06] hover:border-black/15 transition-all flex-shrink-0 shadow-soft-xs">
            <OTTLogo size={42} showText={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider text-white bg-[#0A0A0A] px-2 py-0.5 rounded-md shadow-soft-xs flex-shrink-0">
                OTT
              </span>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-ink-primary whitespace-nowrap">
                Omni Trend Tracker
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/[0.04] border border-black/[0.06] text-neutral-600 flex-shrink-0">
                v1.1 Pro
              </span>
            </div>
            <p className="text-[11px] text-ink-muted hidden sm:block truncate max-w-xs md:max-w-sm lg:max-w-md">
              네이버 데이터랩 • 구글 트렌드 • 메타 인스타그램 크로스 채널 인텔리전스
            </p>
          </div>
        </div>

        {/* ── Center Column: Unified Nav Links (ACV와 100% 동일) ── */}
        <nav className="hidden md:flex items-center space-x-2">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 h-9 px-4 rounded-full bg-white hover:bg-neutral-50 border border-black/[0.08] hover:border-black/20 text-xs font-semibold text-neutral-700 hover:text-black shadow-soft-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="사용 가이드 및 데이터 해석 기준 보기"
            >
              <BookOpen className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
              <span className="whitespace-nowrap">📖 사용 가이드</span>
            </button>
          )}

          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="inline-flex items-center space-x-1.5 h-9 px-4 rounded-full bg-white hover:bg-neutral-50 border border-black/[0.08] hover:border-black/20 text-xs font-semibold text-neutral-700 hover:text-black shadow-soft-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="기능 제안이나 데이터 오류 제보를 남겨주세요."
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="whitespace-nowrap">💡 건의 / 규격 제보</span>
            </button>
          )}

          {onOpenDonation && (
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center space-x-1.5 h-9 px-4 rounded-full bg-white hover:bg-neutral-50 border border-black/[0.08] hover:border-black/20 text-xs font-semibold text-neutral-700 hover:text-black shadow-soft-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="개발자 커피 후원하기"
            >
              <Coffee className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              <span className="whitespace-nowrap">☕ 커피 후원하기</span>
            </button>
          )}
        </nav>

        {/* ── Right Column: Primary Action (Lifemed 'Get Started' style, GitHub 제거) ── */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          {/* ACV Inter-service Link Switcher (Lifemed Jet Black Pill) */}
          <a
            href={ACV_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 h-9 px-4.5 rounded-full bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap flex-shrink-0"
            title="32대 매체 430+ 지면 광고 소재 규격 자동 검수 도구(ACV)로 이동"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <span className="font-mono">ACV</span>
            <span className="hidden sm:inline whitespace-nowrap font-sans font-semibold">소재 검수</span>
            <ExternalLink className="w-3 h-3 text-white/70 flex-shrink-0" />
          </a>
        </div>
      </div>
    </header>
  );
};
