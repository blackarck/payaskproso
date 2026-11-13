/** Same theme the pages used with the CDN build, now compiled at build time. */
export default {
  darkMode: 'class',
  content: ['./index.html', './features.html', './app.js'],
  theme: {
    extend: {
      colors: {
        brand: { ruby: '#E20E3C', 'ruby-dark': '#B50B30', 'ruby-light': '#FF2E5B', 'ruby-subtle': 'rgba(226, 14, 60, 0.08)' },
        payroll: { DEFAULT: '#9C68BB', dark: '#7E4BA3', light: '#C39BE0' },
        accent: { indigo: '#6366F1', emerald: '#10B981', amber: '#F59E0B', cyan: '#06B6D4' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
