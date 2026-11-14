import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { OTTLogo } from './OTTLogo';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-line/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-0.5 rounded-2xl bg-canvas hover:bg-canvas-subtle border border-line transition-all flex-shrink-0">
            <OTTLogo size={42} showText={false} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-md border border-accent/15">
                OTT
              </span>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-ink-primary">
                Omni Trend Tracker
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-canvas-subtle border border-line text-ink-secondary">
                v1.0 Omni-Channel
              </span>
            </div>
            <p className="text-[11px] text-ink-muted hidden sm:block">
              네이버 데이터랩 • 구글 트렌드 • 핀터레스트 • 메타 인스타그램 통합 분석
            </p>
          </div>
        </div>

        {/* Live Engine Status & GitHub Link */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-canvas-subtle border border-line text-xs font-semibold text-ink-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
            <span className="hidden md:inline">4대 플랫폼 실시간 동기화</span>
            <span className="md:hidden">Live Engine</span>
          </div>

          <a
            href="https://github.com/Greycity1988/omni-trend-tracker"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-surface hover:bg-canvas-subtle border border-line hover:border-line-strong text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-all shadow-2xs"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </a>
        </div>
      </div>
    </header>
  );
};
