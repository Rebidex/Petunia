/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50: 'rgb(var(--color-pink-50) / <alpha-value>)',
          100: 'rgb(var(--color-pink-100) / <alpha-value>)',
          200: 'rgb(var(--color-pink-200) / <alpha-value>)',
          300: 'rgb(var(--color-pink-300) / <alpha-value>)',
          400: 'rgb(var(--color-pink-400) / <alpha-value>)',
          500: 'rgb(var(--color-pink-500) / <alpha-value>)',
          600: 'rgb(var(--color-pink-600) / <alpha-value>)',
          700: 'rgb(var(--color-pink-700) / <alpha-value>)',
          800: 'rgb(var(--color-pink-800) / <alpha-value>)',
          900: 'rgb(var(--color-pink-900) / <alpha-value>)',
        },
        brand: {
          pink: 'rgb(var(--color-brand-pink) / <alpha-value>)',
          green: '#4ade80'
        }
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out'
      }
    }
  },
  plugins: []
}
