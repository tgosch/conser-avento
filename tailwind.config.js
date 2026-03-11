/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#E8E8E8',
        text: '#1F2A2C',
        accent1: '#094849',
        accent2: '#E5844E',
      },
      borderRadius: { card: '25px' },
      boxShadow: { card: '6px 6px 18px rgba(9,72,73,0.10)' },
      fontFamily: { sans: ['DM Sans', 'sans-serif'] },
    },
  },
  plugins: [],
}

