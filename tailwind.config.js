/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#F7F0EA',
        },
        warm: {
          black: '#1A1614',
          brown: '#5C534A',
        },
        respiration: '#E3F0FA',
        ancrage: '#D4F0EC',
        echo: '#FCE8EF',
        jardin: '#DEF5E5',
        identite: '#EDE8FA',
        journal: '#FDFBF7',
        psia: '#E2F5E9',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
