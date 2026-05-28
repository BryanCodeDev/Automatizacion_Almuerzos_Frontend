/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: '#10b981',
      },
    },
    fontFamily: {
      sans: ['DM Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
  },
  plugins: [],
}