/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDarker: '#f3e9e2',
        bgLight: '#f9f4f1',
        topBg: '#574b43',
        midGradient: '#b6a598',
        topText: '#fbe8da',
        heartOutline: '#ad7f6f',
        titleText: '#864e3c',
      },
      fontFamily: {
        'great-vibes': ['"Great Vibes"', 'cursive'],
        'alex-brush': ['"Alex Brush"', 'cursive'],
        'amiri': ['"Amiri"', 'serif'],
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
