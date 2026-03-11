/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#E2E2E2',
        surface: '#FFFFFF',
        surface2: '#F5F5F7',
        accent1: '#063D3E',
        accent1light: '#0A5C5E',
        accent2: '#D4662A',
        text: '#1A2426',
        secondary: '#4A5568',
      },
      borderRadius: {
        card: '20px',
        btn: '14px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
        sm2: '0 2px 8px rgba(0,0,0,0.08)',
        top: '0 2px 12px rgba(6,61,62,0.07)',
      },
      fontFamily: { sans: ['DM Sans', 'sans-serif'] },
    },
  },
  plugins: [],
}
