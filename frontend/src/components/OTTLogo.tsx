import React from 'react';

interface OTTLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const OTTLogo: React.FC<OTTLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* OTT Geometric Telemetry Squircle Badge in ACV style */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-md select-none transition-transform hover:scale-105 duration-200"
      >
        <defs>
          <linearGradient id="ottBg" x1="256" y1="16" x2="256" y2="496" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#131b2e" />
            <stop offset="45%" stopColor="#0c101c" />
            <stop offset="100%" stopColor="#060911" />
          </linearGradient>

          <linearGradient id="ottBorder" x1="20" y1="20" x2="492" y2="492" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="30%" stopColor="#6366f1" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="ottLetter" x1="256" y1="180" x2="256" y2="332" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient id="ottTrendArea" x1="256" y1="180" x2="256" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="ottTrendLine" x1="60" y1="360" x2="440" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="80%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          <linearGradient id="ottSurge" x1="390" y1="180" x2="446" y2="138" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Base Squircle */}
        <rect
          x="16"
          y="16"
          width="480"
          height="480"
          rx="116"
          fill="url(#ottBg)"
          stroke="url(#ottBorder)"
          strokeWidth="6"
        />

        {/* Viewfinder Crop Marks */}
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M 44 68 L 44 44 L 68 44" stroke="#38bdf8" strokeWidth="3.5" strokeOpacity="0.6" />
          <path d="M 468 68 L 468 44 L 444 44" stroke="#818cf8" strokeWidth="3.5" strokeOpacity="0.6" />
          <path d="M 44 444 L 44 468 L 68 468" stroke="#10b981" strokeWidth="3.5" strokeOpacity="0.6" />
          <path d="M 468 444 L 468 468 L 444 468" stroke="#f43f5e" strokeWidth="3.5" strokeOpacity="0.6" />
        </g>

        {/* 4-Channel Telemetry Top Pill */}
        <rect x="166" y="52" width="180" height="28" rx="14" fill="#0c1322" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="190" cy="66" r="4.5" fill="#10b981" />
        <circle cx="234" cy="66" r="4.5" fill="#38bdf8" />
        <circle cx="278" cy="66" r="4.5" fill="#a855f7" />
        <circle cx="322" cy="66" r="4.5" fill="#f43f5e" />

        {/* Background Trend Telemetry Wave */}
        <path
          d="M 64 360 C 130 350, 180 320, 230 270 C 280 220, 340 180, 448 138 L 448 370 L 64 370 Z"
          fill="url(#ottTrendArea)"
        />
        <path
          d="M 64 360 C 130 350, 180 320, 230 270 C 280 220, 340 180, 448 138"
          stroke="url(#ottTrendLine)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Monogram: OTT */}
        {/* Letter 'O' */}
        <rect
          x="66"
          y="166"
          width="114"
          height="158"
          rx="48"
          fill="none"
          stroke="url(#ottLetter)"
          strokeWidth="22"
        />
        <circle cx="123" cy="245" r="7" fill="#38bdf8" />

        {/* Letter 'T' #1 */}
        <rect x="194" y="166" width="108" height="24" rx="8" fill="url(#ottLetter)" />
        <rect x="236" y="184" width="24" height="140" rx="8" fill="url(#ottLetter)" />
        <line x1="202" y1="172" x2="294" y2="172" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

        {/* Letter 'T' #2 with Rising Apex Vector */}
        <rect x="314" y="166" width="108" height="24" rx="8" fill="url(#ottLetter)" />
        <rect x="356" y="184" width="24" height="140" rx="8" fill="url(#ottLetter)" />
        <path d="M 398 166 L 442 128" stroke="url(#ottSurge)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 444 126 L 426 128 L 442 144 Z" fill="#10b981" />
        <circle cx="444" cy="126" r="6" fill="#10b981" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-wider text-ink-primary font-mono">OTT</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              RADAR
            </span>
          </div>
          <span className="text-[11px] font-semibold text-ink-muted tracking-tight mt-1">
            Omni Trend Tracker
          </span>
        </div>
      )}
    </div>
  );
};
