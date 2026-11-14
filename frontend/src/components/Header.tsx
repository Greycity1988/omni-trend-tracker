import React from 'react';
import {
  Github,
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
          <div className="p-1.5 rounded-2xl bg-white hover:bg-neutral-50 border border-black/[0.06] hover:border-black/15 transition-all flex-shrink-0 shadow-soft-xs">
            <OTTLogo size={40} showText={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-xs font-mono font-bold tracking-wider text-white bg-[#0A0A0A] px-2 py-0.5 rounded-md shadow-soft-xs flex-shrink-0">
                OTT
              </span>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-ink-primary whitespace-nowrap">
                Omni Trend Tracker
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/[0.04] border border-black/[0.06] text-ink-secondary flex-shrink-0">
                v1.1 Pro
              </span>
            </div>
            <p className="text-[11px] text-ink-muted hidden sm:block truncate max-w-sm lg:max-w-md xl:max-w-xl">
              네이버 데이터랩 • 구글 트렌드 • 메타 인스타그램 크로스 채널 인텔리전스
            </p>
          </div>
        </div>

        {/* Action Buttons & Ecosystem Nav */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {/* Guide Modal Button */}
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 h-9 px-3.5 rounded-full bg-white hover:bg-neutral-50 border border-black/[0.08] hover:border-black/20 text-xs font-medium text-ink-secondary hover:text-ink-primary transition-all cursor-pointer shadow-soft-xs whitespace-nowrap flex-shrink-0"
              title="사용 가이드 및 데이터 해석 기준 보기"
            >
              <BookOpen className="w-3.5 h-3.5 text-ink-tertiary flex-shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">가이드</span>
            </button>
          )}

          {/* Feedback Modal Button */}
          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="inline-flex items-center space-x-1.5 h-9 px-3.5 rounded-full bg-white hover:bg-neutral-50 border border-black/[0.08] hover:border-black/20 text-xs font-medium text-ink-secondary hover:text-ink-primary transition-all cursor-pointer shadow-soft-xs whitespace-nowrap flex-shrink-0"
              title="기능 제안 및 건의사항 남기기"
            >
              <MessageSquare className="w-3.5 h-3.5 text-ink-tertiary flex-shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">건의하기</span>
            </button>
          )}

          {/* Donation Modal Button */}
          {onOpenDonation && (
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center space-x-1.5 h-9 px-3.5 rounded-full bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 border border-amber-200/70 text-xs font-semibold transition-all cursor-pointer shadow-soft-xs whitespace-nowrap flex-shrink-0"
              title="개발자 커피 후원하기"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">커피 후원</span>
            </button>
          )}

          {/* ACV Inter-service Link Switcher */}
          <a
            href={ACV_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 h-9 px-4 rounded-full bg-[#0A0A0A] text-white hover:bg-neutral-800 border border-black text-xs font-bold transition-all shadow-soft-xs cursor-pointer ml-1 whitespace-nowrap flex-shrink-0"
            title="32대 매체 430+ 지면 광고 소재 규격 자동 검수 도구(ACV)로 이동"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="font-mono">ACV</span>
            <span className="hidden lg:inline font-sans font-semibold whitespace-nowrap">소재 검수</span>
            <ExternalLink className="w-3 h-3 text-white/80 flex-shrink-0" />
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/Greycity1988/omni-trend-tracker"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full bg-white hover:bg-neutral-50 border border-black/[0.08] hover:border-black/20 text-ink-secondary hover:text-ink-primary transition-all shadow-soft-xs whitespace-nowrap flex-shrink-0"
            title="GitHub 저장소"
          >
            <Github className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>
      </div>
    </header>
  );
};
