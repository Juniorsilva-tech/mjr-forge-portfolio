/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: '#030305',
        ember: '#e8842e',
        ash: '#a69b90',
      },
      boxShadow: {
        forge: '0 30px 140px rgba(0,0,0,.55)',
        ember: '0 0 50px rgba(232,132,46,.28)',
      },
    },
  },
  plugins: [],
}
