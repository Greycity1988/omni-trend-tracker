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
          DEFAULT: '#F8F8F6',
          subtle: '#F2F2EF',
          muted: '#EAEAE5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FFFFFF',
          overlay: 'rgba(255, 255, 255, 0.95)',
        },
        line: {
          subtle: '#F0F0EC',
          DEFAULT: '#E8E8E4',
          strong: '#D6D6D0',
        },
        ink: {
          primary: '#111815',
          secondary: '#5A6660',
          tertiary: '#7E8B85',
          muted: '#9EABA4',
          faint: '#D1D8D4',
        },
        accent: {
          DEFAULT: '#143126',     // Deep Pine Forest
          hover: '#0E241B',
          soft: '#EAF0EC',
          mint: '#10B981',       // High-visibility mint status
          naver: '#03C75A',
          google: '#4285F4',
          pinterest: '#E60023',
          meta: '#E1306C',
        },
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(17, 24, 21, 0.04)',
        'soft-sm': '0 2px 6px -1px rgba(17, 24, 21, 0.06), 0 1px 3px -1px rgba(17, 24, 21, 0.04)',
        'soft-md': '0 8px 18px -3px rgba(17, 24, 21, 0.07), 0 3px 6px -2px rgba(17, 24, 21, 0.04)',
        'soft-lg': '0 16px 32px -4px rgba(17, 24, 21, 0.08), 0 6px 12px -3px rgba(17, 24, 21, 0.04)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
