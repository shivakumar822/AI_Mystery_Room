/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mystery: {
          950: '#04070e',
          900: '#080d19',
          850: '#0e1526',
          800: '#141e34',
          750: '#1c2844',
          700: '#26375c',
          600: '#394f80',
          500: '#5370ab',
        },
        noir: {
          gold: '#e6b356',
          goldLight: '#fbe29f',
          goldDark: '#b5832a',
          amber: '#f59e0b',
          crimson: '#e11d48',
          crimsonLight: '#fb7185',
          crimsonDark: '#881337',
          emerald: '#10b981',
          cyan: '#06b6d4',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 35px -5px rgba(230, 179, 86, 0.35)',
        'glow-crimson': '0 0 35px -5px rgba(225, 29, 72, 0.45)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
        'dossier': '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(230, 179, 86, 0.15)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
