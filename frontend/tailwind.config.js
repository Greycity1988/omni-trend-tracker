/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#99A3A2',
          bgDark: '#8A9190',
          canvasDark: '#010101',
        },
        mono: {
          black: '#000000',
          card: '#141416',
          cardHover: '#1c1d20',
          cardInner: '#1e1f23',
          cardBorder: '#26272c',
          pill: '#202126',
          pillHover: '#2e2f36',
          dim: '#6E6E6E',
          nickel: '#6B7271',
          sub: '#AEAEAE',
          silver: '#99A3A2',
          white: '#FFFFFF',
        },
        signal: {
          DEFAULT: '#A8FF1A',
          dark: '#0c2205',
          border: '#A8FF1A',
        },
        warning: {
          DEFAULT: '#F34238',
          dark: '#2a0a08',
          border: '#F34238',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
