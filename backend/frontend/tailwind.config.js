/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcdeff',
          300: '#8ecbff',
          400: '#59adff',
          500: '#246bfe',
          600: '#1957d8',
          700: '#1746ad',
          800: '#183a8a',
          900: '#19336e',
        },
        ink: '#172033',
      },
      boxShadow: {
        soft: '0 12px 32px rgba(23, 32, 51, 0.08)',
        card: '0 1px 3px rgba(23, 32, 51, 0.06), 0 4px 12px rgba(23, 32, 51, 0.04)',
        'card-hover': '0 4px 16px rgba(23, 32, 51, 0.10), 0 1px 4px rgba(23, 32, 51, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
