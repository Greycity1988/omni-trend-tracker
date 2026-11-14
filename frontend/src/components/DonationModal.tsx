import React from 'react';
import { X, Coffee, Heart, ExternalLink, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BUY_ME_A_COFFEE_URL } from '../constants/links';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md rounded-3xl border border-[#26272c] shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: '#141416' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#26272c] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#202126] border border-[#2e2f36] text-[#A8FF1A] flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                개발자에게 커피 한 잔 선물하기
              </h3>
              <p className="text-[11px] text-[#AEAEAE]">
                OTT 및 마케팅 인텔리전스 스위트 개발의 원동력이 됩니다
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1a1b1f] hover:bg-[#26272c] border border-[#2e2f36] flex items-center justify-center text-[#AEAEAE] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-5">
          <p className="text-xs text-[#AEAEAE] leading-relaxed">
            Omni Trend Tracker(OTT)는 마케터와 크리에이터를 위해 100% 무료로 개발 및 유지되고 있습니다.
            도구가 유용하셨다면 따뜻한 응원을 보내주세요!
          </p>

          {/* QR Code Container */}
          <div className="p-4 bg-[#1a1b1f] rounded-2xl border border-[#26272c] inline-block mx-auto shadow-xl">
            <div className="p-2.5 bg-white rounded-xl">
              <QRCodeSVG
                value={BUY_ME_A_COFFEE_URL}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[10px] text-[#AEAEAE] font-mono mt-2 block">
              카메라로 QR을 스캔하세요
            </span>
          </div>

          <div className="space-y-2.5">
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full h-11 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] text-black font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current text-black" />
              <span>Buy Me a Coffee 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#6E6E6E] pt-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A8FF1A]" />
              <span>Stripe 기반 안전 결제 보호 · 해외/국내 카드 지원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
