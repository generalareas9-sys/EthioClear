// tailwind.config.js
// Tailwind CSS configuration for EthioClear.

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: 'var(--color-bg-app)',
        surface: 'var(--color-bg-surface)',
        card: 'var(--color-bg-card)',
        'card-subtle': 'var(--color-bg-subtle)',
        header: 'var(--color-bg-header)',
        
        'border-theme': 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-focus': 'var(--color-border-focus)',

        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',

        gold: {
          50: '#fdfbf0',
          100: '#faf5dc',
          200: '#f3e8ae',
          300: '#ebd67b',
          400: '#e1be47',
          500: '#d4a017',
          600: '#b8860b',
          700: '#92650c',
          800: '#775010',
          900: '#644212',
        },
        navy: {
          50: '#f0f4fa',
          100: '#dce6f4',
          200: '#bdd1ec',
          300: '#90b4e0',
          400: '#5c90cf',
          500: '#3972bc',
          600: '#2858a3',
          700: '#214684',
          800: '#1e3c6d',
          900: '#0f2a6b',
          950: '#0a1945',
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
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
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
      },
      fontFamily: {
        sans: ['"Outfit"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
