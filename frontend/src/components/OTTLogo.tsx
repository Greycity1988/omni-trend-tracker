import React from 'react';

interface OTTLogoProps {
  size?: number;
  className?: string;
}

/**
 * OTT emblem in the suite's triangle badge (same geometry as ACVLogo).
 * O (Omni): a ring with four channel dots, one per data source.
 * T (Trend): the crossbar is a rising trend line with an arrowhead.
 * T (Tracker): the stem ends in a radar ping.
 */
export const OTTLogo: React.FC<OTTLogoProps> = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size * 0.9}
    viewBox="0 0 200 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 drop-shadow-md select-none ${className}`}
    role="img"
    aria-label="OTT"
  >
    <defs>
      <linearGradient id="ottBg" x1="100" y1="8" x2="100" y2="172" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#131b2e" />
        <stop offset="100%" stopColor="#060911" />
      </linearGradient>
      <linearGradient id="ottBorder" x1="20" y1="20" x2="180" y2="170" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="ottLetter" x1="100" y1="30" x2="100" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="ottAccent" x1="110" y1="100" x2="170" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>

    <path
      d="M 91.5 21.5
             C 95.5 14.5, 104.5 14.5, 108.5 21.5
             L 182.5 149.5
             C 186.5 156.5, 182.0 165.0, 174.0 165.0
             L 26.0 165.0
             C 18.0 165.0, 13.5 156.5, 17.5 149.5
             Z"
      fill="url(#ottBg)"
      stroke="url(#ottBorder)"
      strokeWidth="6"
      strokeLinejoin="round"
    />

    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* O = Omni: one ring, four channels */}
      <circle cx="100" cy="70" r="16" stroke="url(#ottLetter)" strokeWidth="9" />
      <circle cx="100" cy="54" r="4" fill="#10b981" stroke="none" />
      <circle cx="116" cy="70" r="4" fill="#38bdf8" stroke="none" />
      <circle cx="100" cy="86" r="4" fill="#f43f5e" stroke="none" />
      <circle cx="84" cy="70" r="4" fill="#a855f7" stroke="none" />
      {/* T = Trend: rising crossbar */}
      <path d="M 66 122 L 66 153" stroke="url(#ottLetter)" strokeWidth="9" />
      <path d="M 47 129 L 84 113" stroke="url(#ottAccent)" strokeWidth="8" />
      <path d="M 76 110 L 87 112 L 82 122" stroke="url(#ottAccent)" strokeWidth="5" />
      {/* T = Tracker: radar ping at the stem */}
      <path d="M 116 112 L 154 112" stroke="url(#ottLetter)" strokeWidth="9" />
      <path d="M 135 112 L 135 136" stroke="url(#ottLetter)" strokeWidth="9" />
      <circle cx="135" cy="149" r="5" fill="#10b981" stroke="none" />
      <circle cx="135" cy="149" r="11" stroke="#10b981" strokeWidth="2.5" strokeOpacity="0.55" />
    </g>
  </svg>
);
