/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#FF4949',
            dark: '#E60000',
            light: '#FF8080'
          },
          secondary: {
            DEFAULT: '#45B7AE',
            dark: '#338B84',
            light: '#7CCCC5'
          }
        }
      }
    },
    plugins: [],
  }