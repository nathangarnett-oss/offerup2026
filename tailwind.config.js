/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // OfferUp brand teal/green
        primary: {
          50: '#e6f7f2',
          100: '#ccefe5',
          200: '#99dfcb',
          300: '#66cfb1',
          400: '#33bf97',
          500: '#00ab80', // OfferUp primary
          600: '#009970',
          700: '#007a5a',
          800: '#005c43',
          900: '#003d2d',
          950: '#001f17',
        },
        // OfferUp accent - warm orange for promotions/CTAs
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Neutral surface colors
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // OfferUp specific semantic colors
        offerup: {
          teal: '#00ab80',
          dark: '#1a1a2e',
          blue: '#0066ff',
          red: '#e53935',
          gold: '#f5a623',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
