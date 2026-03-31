import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f6f7fb',
        foreground: '#0f172a',
        gold: {
          DEFAULT: '#0ea5e9',
          light: '#7dd3fc',
          dark: '#0284c7',
        },
        muted: '#5b6b80',
        border: '#d9e1ec',
        card: '#ffffff',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(10 20 30 / 0.06), 0 1px 2px -1px rgb(10 20 30 / 0.06)',
        'card-hover': '0 10px 24px -10px rgb(10 20 30 / 0.22)',
        elevated: '0 24px 40px -24px rgb(10 20 30 / 0.5)',
      },
    },
  },
  plugins: [],
}

export default config
