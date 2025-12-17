/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0B1220',
          800: '#111B2E',
          700: '#17233A',
        },
        paper: {
          50: '#FFFFFF',
          100: '#FAFAFC',
          200: '#F2F4F8',
        },
        accent: {
          cyan: '#06B6D4',
          violet: '#8B5CF6',
          lime: '#84CC16',
          rose: '#F43F5E',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,18,32,0.06), 0 10px 30px rgba(11,18,32,0.08)',
      },
    },
  },
  plugins: [],
}

