/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
        },
        accent: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
        neutral: {
          100: '#f9fafb',
          200: '#e5e7eb',
          700: '#374151',
          900: '#111827',
        },
      },
      boxShadow: {
        card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}