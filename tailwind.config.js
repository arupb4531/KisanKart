/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        earth: {
          50: '#faf8f5',
          100: '#f3ede5',
          200: '#e6dacb',
          300: '#d5c0ab',
          400: '#c0a289',
          500: '#af8a70',
          600: '#a2785f',
          700: '#87624e',
          800: '#6f5042',
          900: '#5b4338',
          950: '#31231c',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Outfit', 'sans-serif'],
        serif: ['var(--font-display)', 'Outfit', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 25px -4px rgba(22, 101, 52, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 35px -5px rgba(22, 101, 52, 0.08), 0 4px 14px -2px rgba(0, 0, 0, 0.03)',
        'elevated': '0 20px 50px -10px rgba(22, 101, 52, 0.14), 0 8px 20px -4px rgba(0, 0, 0, 0.06)',
        'glow-emerald': '0 0 35px -5px rgba(34, 197, 94, 0.35)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
