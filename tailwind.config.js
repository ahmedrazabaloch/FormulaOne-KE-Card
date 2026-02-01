/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#E63946',
        'primary-dark': '#D32F2F',
        'primary-light': '#F1F1F1',
        secondary: '#457B9D',
        accent: '#F1FAEE',
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#D0D0D0',
          400: '#999999',
          500: '#6B6B6B',
          600: '#333333',
          700: '#222222',
          800: '#1C1C1C',
          900: '#111111',
        },
        success: '#2E7D32',
        warning: '#F57C00',
        error: '#E53935',
        info: '#1976D2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
        typewriter: ['"Courier New"', '"Courier"', 'monospace'],
      },
      spacing: {
        'mm': '1mm',
        '3mm': '3mm',
        '5mm': '5mm',
        '10mm': '10mm',
        '15mm': '15mm',
        '20mm': '20mm',
      },
      borderRadius: {
        'card': '2px',
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'medium': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'xl': '0 20px 60px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(-100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { transform: 'translateY(40px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
