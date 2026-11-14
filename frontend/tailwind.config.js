/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          muted: '#F1F5F9',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FFFFFF',
          overlay: 'rgba(255, 255, 255, 0.85)',
          glass: 'rgba(255, 255, 255, 0.82)',
        },
        line: {
          subtle: 'rgba(0, 0, 0, 0.04)',
          DEFAULT: 'rgba(0, 0, 0, 0.06)',
          strong: 'rgba(0, 0, 0, 0.12)',
        },
        ink: {
          primary: '#0A0A0A',
          secondary: '#52525B',
          tertiary: '#71717A',
          muted: '#A1A1AA',
          faint: '#E4E4E7',
        },
        accent: {
          DEFAULT: '#0A0A0A',     // Lifemed Jet Black
          hover: '#262626',
          soft: '#F4F4F5',
          mint: '#10B981',        // High-visibility mint status
          naver: '#03C75A',
          google: '#4285F4',
          pinterest: '#E60023',
          meta: '#E1306C',
        },
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'soft-sm': '0 4px 14px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'soft-md': '0 8px 26px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 16px 36px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'lifemed': '0 8px 30px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
