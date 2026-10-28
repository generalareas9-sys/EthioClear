// tailwind.config.js
// Tailwind CSS configuration for EthioClear.
//
// Color palette: "primary" (blue) and "secondary" (green) are defined
// as full 50–900 scales so components have room for hover/active/
// disabled states, not just one flat brand color. The 700-shade of
// each intentionally matches the colors already used in the
// certificate PDF (Module 8: #1D4ED8 blue banner text, #15803D green
// subtitle) so a certificate and the web portal read as one product.

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8', // matches certificate PDF header color
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D', // matches certificate PDF subtitle color
          800: '#166534',
          900: '#14532D',
        },
      },
      fontFamily: {
        // System font stack: fast, accessible, no external font
        // requests — appropriate for a government-style portal.
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
