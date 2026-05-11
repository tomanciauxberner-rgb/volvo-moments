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
    },
  },
  plugins: [],
};

export default config;
