/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sepia: {
          DEFAULT: '#F5EDE3',
          dark: '#121212',
          lighter: '#FAF8F5',
        },
        gold: {
          DEFAULT: '#D4A574',
          dark: '#FFD700',
          light: '#E8C49A',
        },
        ink: {
          DEFAULT: '#2D1E12',
          light: '#F5EDE3',
          muted: '#5C4A3D',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Source Sans 3', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
