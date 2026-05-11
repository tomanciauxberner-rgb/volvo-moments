import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        volvo: ['"Volvo Novum"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'volvo-ink': '#141414',
        'volvo-bg': '#ffffff',
        'volvo-mute': '#707070',
        'volvo-line': '#e5e5e5',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.9s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
