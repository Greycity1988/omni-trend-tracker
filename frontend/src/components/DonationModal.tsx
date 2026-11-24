import React, { useState, useEffect } from 'react';
import {
  X,
  Coffee,
  Heart,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Globe,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { KO_FI_URL } from '../constants/links';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(KO_FI_URL);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = KO_FI_URL;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast('Ko-fi 후원 링크가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast(`링크: ${KO_FI_URL}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="후원하기" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white dark:border-[#26272c] dark:bg-[#141416] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#26272c] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-[#202126] dark:border-[#2e2f36] text-amber-500 flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide flex items-center space-x-1.5">
                <span>개발자 커피 후원하기</span>
                <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#202126] dark:text-[#AEAEAE] dark:border-[#2e2f36] px-2 py-0.5 rounded-full">
                  Coffee Sponsorship
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#AEAEAE] mt-0.5">
                안전하고 간편한 글로벌 창작자 후원 플랫폼
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:bg-[#1a1b1f] dark:hover:bg-[#26272c] dark:border-[#2e2f36] dark:text-[#AEAEAE] dark:hover:text-white transition-colors cursor-pointer"
            title="닫기 (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3 bg-[#A8FF1A] text-black rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fadeIn shadow-md">
              <Check className="w-4 h-4 text-black flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* QR Code Container */}
          <div className="p-5 bg-slate-50 dark:bg-[#1a1b1f] rounded-2xl border border-slate-200 dark:border-[#26272c] flex flex-col items-center text-center space-y-3 transition-colors">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#202126] border border-slate-200 dark:border-[#2e2f36] text-slate-600 dark:text-[#AEAEAE] text-[11px] font-semibold">
              <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A8FF1A]" />
              <span>스마트폰 카메라로 비추면 3초 만에 연결</span>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
              <QRCodeSVG
                value={KO_FI_URL}
                size={148}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                PC 사용자는 카메라로 QR 코드를 비추시거나,
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#AEAEAE]">
                아래 버튼을 눌러 Ko-fi 공식 페이지에서 바로 후원하실 수 있습니다.
              </p>
            </div>
          </div>

          {/* Witty Encouragement Banner */}
          <div className="p-3.5 bg-slate-50 dark:bg-[#1a1b1f] rounded-2xl border border-slate-200 dark:border-[#26272c] flex items-center space-x-3 text-xs transition-colors">
            <span className="text-xl flex-shrink-0">☕✨</span>
            <div className="leading-snug">
              <strong className="text-slate-900 dark:text-white font-bold text-xs">
                당신의 $1가 개발자에게 큰 힘이 됩니다!
              </strong>
              <p className="text-[11px] text-slate-500 dark:text-[#AEAEAE] mt-0.5">
                야근과 크로스 채널 검색 트렌드 및 쿼리 지수 연구를 이어가는 가장 달콤한 연료입니다 🚀
              </p>
            </div>
          </div>

          {/* Main CTA & Copy Link Bar */}
          <div className="space-y-2.5">
            <a
              href={KO_FI_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full h-11 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] text-black font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Coffee className="w-4 h-4 text-black fill-current" />
              <span>Ko-fi로 커피 한 잔 후원하기</span>
              <ExternalLink className="w-3.5 h-3.5 text-black" />
            </a>

            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-[#1a1b1f] rounded-full text-xs font-mono text-slate-600 dark:text-[#AEAEAE] truncate border border-slate-200 dark:border-[#26272c]">
                ko-fi.com/greycity1988
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                  copied
                    ? 'bg-[#A8FF1A] text-black border-transparent shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:text-white dark:border-[#2e2f36]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-[#AEAEAE]" />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Safe & Global Support Notice */}
          <div className="p-4 bg-slate-50 dark:bg-[#1a1b1f] rounded-2xl border border-slate-200 dark:border-[#26272c] space-y-2 text-[11px] text-slate-600 dark:text-[#AEAEAE] leading-relaxed transition-colors">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A8FF1A]" />
              <span>안전한 글로벌 창작자 후원 플랫폼</span>
            </div>
            <p>
              <strong className="text-slate-900 dark:text-white">Ko-fi</strong>는 전 세계 수백만 창작자와 개발자가 사용하는 안전한 후원 플랫폼입니다. PayPal 및 국내외 신용카드, 체크카드로 계좌번호나 개인정보 노출 없이 간편하게 마음을 전하실 수 있습니다.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-[#26272c] flex items-start space-x-1.5 text-slate-500 dark:text-[#AEAEAE]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A8FF1A] flex-shrink-0 mt-0.5" />
              <span>
                후원금은 <strong>OTT의 완전 무료 서비스 유지와 크로스 채널 트렌드 수집 및 인프라 유지</strong>에 소중하게 사용됩니다.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#141416] flex items-center justify-between text-xs text-slate-500 dark:text-[#AEAEAE] flex-shrink-0 transition-colors">
          <span className="flex items-center space-x-1.5 text-[11px]">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Thank you for supporting Owen O. Magnus!</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-700 hover:text-emerald-600 dark:text-white dark:hover:text-[#A8FF1A] font-bold text-xs cursor-pointer transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
