/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c8102e', // Red from screenshots
          light: '#e31c3d',
          dark: '#a00c24',
        },
        secondary: {
          DEFAULT: '#ea7600', // Orange from screenshots
          light: '#f59e0b',
          dark: '#c2410c',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',   // Slate 50
          border: '#e2e8f0',  // Slate 200
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
