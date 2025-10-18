import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7ff',
          100: '#e5edff',
          200: '#cdd9ff',
          300: '#a6b8ff',
          400: '#7d90ff',
          500: '#5665ff',
          600: '#3b40f5',
          700: '#2c2fce',
          800: '#2327a3',
          900: '#1f2480',
        },
      },
    },
  },
  plugins: [typography],
}

