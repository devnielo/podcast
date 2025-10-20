import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fde6e6',
          200: '#f9bcbc',
          300: '#f49191',
          400: '#ed5d5d',
          500: '#e63636',
          600: '#c42323',
          700: '#981818',
          800: '#6c1010',
          900: '#470909',
        },
        ink: {
          50: '#f7f7f7',
          100: '#efefef',
          200: '#dcdcdc',
          300: '#c3c3c3',
          400: '#9c9c9c',
          500: '#747474',
          600: '#4f4f4f',
          700: '#333333',
          800: '#1f1f1f',
          900: '#111111',
        },
        dark: {
          bg: '#000000',
          surface: '#121212',
          card: '#181818',
          hover: '#282828',
          border: '#282828',
          text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
            muted: '#6a6a6a',
          },
        },
      },
      fontFamily: {
        sans: ['"Monument Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Monument Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Monument Grotesk Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        wide: '.2em',
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [typography],
}

