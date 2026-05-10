/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#e91e8c',
          green: '#4ade80'
        }
      }
    }
  },
  plugins: []
}
