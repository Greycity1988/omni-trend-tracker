import React, { useState } from 'react';
import {
  X,
  Coffee,
  Heart,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const BMC_URL = 'https://buymeacoffee.com/greycity1988';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(BMC_URL);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = BMC_URL;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast('Buy Me a Coffee 후원 링크가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast(`링크: ${BMC_URL}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-3xl shadow-soft-lg border border-line w-full max-w-md overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-line flex items-center justify-between bg-surface flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent text-white rounded-2xl shadow-soft-xs">
              <Coffee className="w-5 h-5 text-[#FFDD00]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-primary flex items-center space-x-1.5">
                <span>개발자 커피 후원하기</span>
                <span className="text-[10px] font-mono font-semibold bg-canvas-subtle text-ink-secondary border border-line px-2 py-0.5 rounded-full">
                  Coffee Sponsorship
                </span>
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Omni Trend Tracker 서비스의 지속적인 발전을 응원해 주세요
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-ink-muted hover:text-ink-primary hover:bg-canvas-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3 bg-accent text-white rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn shadow-soft-sm">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-accent-mint flex-shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-white/80 hover:text-white ml-2 text-xs"
              >
                닫기
              </button>
            </div>
          )}

          {/* Warm Thank You Note */}
          <div className="p-4 rounded-2xl border border-line bg-canvas-subtle/60 space-y-2">
            <div className="flex items-center space-x-2 text-ink-primary font-semibold text-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>무료 공개 프로젝트를 위한 따뜻한 응원</span>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Omni Trend Tracker(OTT)는 마케터와 크리에이터 분들이 네이버, 구글, 핀터레스트, 인스타그램의 키워드 검색량을 별도 유료 툴 없이 한눈에 파악하실 수 있도록 <strong>100% 무료 오픈 프로젝트</strong>로 개발 및 유지되고 있습니다.
            </p>
            <p className="text-xs text-ink-muted leading-relaxed">
              보내주신 커피 한 잔의 따뜻한 후원은 API 유지비와 신규 트렌드 엔진 개발에 큰 힘이 됩니다.
            </p>
          </div>

          {/* Buy Me a Coffee Official Card with QR */}
          <div className="p-5 rounded-2xl border border-line bg-surface shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFDD00] flex items-center justify-center text-ink-primary font-black text-xs shadow-2xs">
                  ☕
                </div>
                <div>
                  <div className="text-sm font-bold text-ink-primary">Buy Me a Coffee</div>
                  <div className="text-[11px] text-ink-secondary font-mono">
                    buymeacoffee.com/greycity1988
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                해외/국내 카드 지원
              </span>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl border border-line flex flex-col items-center justify-center space-y-2.5">
              <div className="p-2 bg-white rounded-xl shadow-2xs">
                <QRCodeSVG
                  value={BMC_URL}
                  size={148}
                  level="M"
                  includeMargin={false}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFDD00"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>',
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                <QrCode className="w-3.5 h-3.5" />
                <span>스마트폰 카메라로 스캔하면 바로 연결됩니다</span>
              </div>
            </div>

            {/* Buttons: Direct Link & Copy URL */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={BMC_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-[#FFDD00] hover:bg-[#FACC15] text-slate-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <span>후원 페이지 열기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-canvas-subtle hover:bg-canvas text-ink-primary border border-line font-semibold text-xs transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accent-mint" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-ink-secondary" />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sponsoring Perks */}
          <div className="p-4 rounded-2xl border border-line bg-canvas-subtle/40 space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 text-ink-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>후원금은 어떻게 사용되나요?</span>
            </div>
            <ul className="space-y-1 text-ink-secondary pl-4 list-disc text-[11.5px] leading-relaxed">
              <li>네이버 / 핀터레스트 / 메타 / 구글 API 트래픽 및 클라우드 인프라 유지비</li>
              <li>키워드 다중 비교, 엑셀 다운로드 등 신규 분석 기능 업데이트</li>
              <li>광고 소재 검수 도구(ACV)와의 통합 분석 기능 고도화</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-canvas-subtle flex items-center justify-between text-xs text-ink-muted flex-shrink-0">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stripe 기반 안전 결제 보호</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-canvas border border-line transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
