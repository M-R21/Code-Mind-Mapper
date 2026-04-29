/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0e0f11',
          secondary: '#161719',
          elevated: '#1e2024',
        },
        border: '#2a2c30',
        text: {
          primary: '#e8e9eb',
          secondary: '#8b8d94',
          muted: '#52545c',
        },
        node: {
          model: '#4f9ef8',
          view: '#7ec87e',
          url: '#e8965a',
          form: '#b97cf5',
          serializer: '#5dd9c1',
          admin: '#f0798a',
          signal: '#f5c842',
          function: '#94a3b8',
          class: '#c084fc',
          file: '#64748b',
          celery: '#fb923c',
          route: '#e8965a',
          blueprint: '#38bdf8'
        }
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['"Berkeley Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
