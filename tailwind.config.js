/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',   // electric sky — modern, sophisticated, non-purple
          dim:     '#0284c7',
          glow:    'rgba(14,165,233,0.25)',
          subtle:  'rgba(14,165,233,0.10)',
        },
        bg: {
          base:     '#0d0f14',  // deepest dark — page canvas
          surface:  '#161a22',  // cards, sidebar
          elevated: '#1e2330',  // hover states, nested cards
          overlay:  '#242938',  // dropdowns, tooltips
        },
        border: {
          subtle:  '#1e2330',   // barely-there dividers
          default: '#2a3042',   // card edges
          strong:  '#3d4760',   // focused inputs
        },
        text: {
          primary: '#eef0f6',   // off-white
          muted:   '#7c87a0',   // secondary text
          faint:   '#4a5568',   // disabled / placeholder
        },
        stat: {
          mint:    '#d1fae5',
          'mint-t':'#065f46',
          yellow:  '#fef3c7',
          'yel-t': '#92400e',
          lavender:'#ede9fe',
          'lav-t': '#4c1d95',
          peach:   '#ffe4e6',
          'pch-t': '#881337',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
