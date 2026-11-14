import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Send, CheckCircle2 } from 'lucide-react';
import { DEV_EMAIL } from '../constants/links';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('신규 채널 추가');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEV_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setMessage('');
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg rounded-3xl border border-[#26272c] shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: '#141416' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#26272c] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#202126] border border-[#2e2f36] text-[#A8FF1A] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                건의 / 기능 제안
              </h3>
              <p className="text-[11px] text-[#AEAEAE]">
                더 유용한 OTT를 위한 아이디어를 들려주세요
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#A8FF1A] text-black flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">소중한 의견이 접수되었습니다!</h4>
              <p className="text-[#AEAEAE]">
                보내주신 피드백은 검토 후 OTT 다음 버전에 적극 반영하겠습니다.
              </p>
            </div>
          ) : (
            <>
              {/* Category Radio Group */}
              <div className="space-y-1.5">
                <label className="font-bold text-white text-xs">문의 유형</label>
                <div className="grid grid-cols-3 gap-2">
                  {['신규 채널 추가', '데이터 오차 제보', '기타 제안'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`h-9 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-[#A8FF1A] text-black font-extrabold border-transparent shadow-sm'
                          : 'bg-[#1a1b1f] text-[#AEAEAE] hover:text-white border-[#2e2f36]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-white text-xs">내용</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="추가 연동을 희망하는 플랫폼(틱톡, 유튜브 쇼핑 등)이나 개선 아이디어를 자유롭게 적어주세요."
                  className="w-full p-3.5 rounded-2xl bg-[#1a1b1f] border border-[#2e2f36] focus:border-[#A8FF1A] text-white placeholder:text-[#6E6E6E] text-xs resize-none focus:outline-none transition-all"
                />
              </div>

              {/* Direct Email Callout */}
              <div className="p-3.5 rounded-2xl bg-[#1a1b1f] border border-[#26272c] flex items-center justify-between text-xs text-[#AEAEAE]">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] uppercase text-[#6E6E6E]">Direct Developer Contact</span>
                  <div className="font-mono text-white text-xs font-bold">{DEV_EMAIL}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="h-8 px-3 rounded-full bg-[#202126] hover:bg-[#2c2d33] border border-[#2e2f36] text-white font-medium text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#A8FF1A]" />
                      <span className="text-[#A8FF1A] font-bold">복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#AEAEAE]" />
                      <span>이메일 복사</span>
                    </>
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-full h-11 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] disabled:opacity-40 text-black font-extrabold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>피드백 전송하기</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
