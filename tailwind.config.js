/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff2fb3',
          purple: '#8b5cf6',
          cyan: '#22d3ee',
          lime: '#b3ff00'
        }
      },
      boxShadow: {
        glow: '0 0 8px -2px rgba(255,255,255,0.3), 0 4px 24px -4px rgba(0,0,0,0.6)',
        neon: '0 0 10px -2px #ff2fb3, 0 0 24px -4px #8b5cf6'
      },
      animation: {
        'fade-in': 'fadeIn .5s ease both',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: .65 } }
      }
    },
  },
  plugins: [],
}

