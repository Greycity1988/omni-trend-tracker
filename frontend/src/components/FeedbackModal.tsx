import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { GITHUB_ISSUES_URL, buildIssueUrl } from '../constants/links';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('신규 채널 추가');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Feedback is received on GitHub Issues: open a prefilled issue the user submits there.
    window.open(buildIssueUrl(category, message), '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setTimeout(() => {
      setMessage('');
      setSubmitted(false);
      onClose();
    }, 4000);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="건의 / 기능 제안" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white dark:border-[#26272c] dark:bg-[#141416] shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#26272c] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-[#202126] dark:border-[#2e2f36] text-emerald-700 dark:text-[#A8FF1A] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                건의 / 기능 제안
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#AEAEAE]">
                더 유용한 OTT를 위한 아이디어를 들려주세요
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:bg-[#1a1b1f] dark:hover:bg-[#202126] dark:border-[#2e2f36] dark:text-[#AEAEAE] dark:hover:text-white transition-colors cursor-pointer"
            title="닫기 (Esc)"
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
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">GitHub 이슈 작성 화면을 새 탭으로 열었습니다</h4>
              <p className="text-slate-500 dark:text-[#AEAEAE]">
                GitHub에서 'Submit new issue'를 눌러야 접수됩니다. GitHub 계정이 필요합니다.
              </p>
            </div>
          ) : (
            <>
              {/* Category Radio Group */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 dark:text-white text-xs">문의 유형</label>
                <div className="grid grid-cols-3 gap-2">
                  {['신규 채널 추가', '데이터 오차 제보', '기타 제안'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`h-9 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-[#A8FF1A] text-black font-extrabold border-transparent shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:hover:text-white dark:border-[#2e2f36]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 dark:text-white text-xs">내용</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="추가 연동을 희망하는 플랫폼(틱톡, 유튜브 쇼핑 등)이나 개선 아이디어를 자유롭게 적어주세요."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400 dark:bg-[#1a1b1f] dark:border-[#2e2f36] dark:focus:border-[#A8FF1A] dark:text-white dark:placeholder:text-[#6E6E6E] text-xs resize-none focus:outline-none transition-all"
                />
              </div>

              {/* Where feedback goes */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#1a1b1f] dark:border-[#26272c] flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#AEAEAE]">
                <span>의견은 GitHub 이슈로 접수됩니다. 보내기를 누르면 내용이 채워진 작성 화면이 열립니다.</span>
                <a
                  href={GITHUB_ISSUES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-3 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:border-[#2e2f36] dark:text-white font-medium text-xs flex items-center space-x-1 flex-shrink-0"
                >
                  <span>이슈 목록</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-full h-11 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] disabled:opacity-40 text-black font-extrabold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>GitHub 이슈로 보내기</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
