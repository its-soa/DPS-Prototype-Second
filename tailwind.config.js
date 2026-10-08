/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        canvas: '#f6f7f4',
        ink: '#0f172a',
        brand: {
          50: '#edf7f6',
          100: '#d4ecea',
          200: '#a8d8d4',
          500: '#17808a',
          600: '#0f6b73',
          700: '#0b5560',
          800: '#0a4650',
          900: '#083741',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px -12px rgba(15,23,42,.18)',
      },
    },
  },
  plugins: [],
}
