/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',      // Blue
        secondary: '#0F766E',    // Teal
        accent: '#F97316',       // Orange
        success: '#10B981',      // Green
        danger: '#EF4444',       // Red
        warning: '#F59E0B',      // Yellow
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}