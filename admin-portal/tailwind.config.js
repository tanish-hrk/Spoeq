/**** Tailwind config for admin portal ****/
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        leaf: '#34D399',
        moss: '#10B981',
        fern: '#065F46',
        grass: '#22C55E',
      },
    },
  },
  plugins: [],
}
