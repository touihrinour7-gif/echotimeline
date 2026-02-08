/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme
        sepia: {
          50: '#FAF8F5',
          100: '#F5EDE3',
          200: '#EBE5D5',
          300: '#D9CDC0',
          400: '#C4B29E',
          500: '#D4A574',
          600: '#B8925E',
          700: '#8B6F47',
          800: '#2D1E12',
          900: '#1A1410',
        },
        // Dark theme
        midnight: {
          50: '#1A1A1A',
          100: '#121212',
          200: '#0D0D0D',
          300: '#080808',
          gold: '#FFD700',
          goldlight: '#FFE44D',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'scroll': 'scroll 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
