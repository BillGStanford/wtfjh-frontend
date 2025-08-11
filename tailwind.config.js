module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'wtf-primary': '#ff6b35', // Neon orange for primary actions
        'wtf-secondary': '#004e89', // Deep teal for secondary elements
        'wtf-accent': '#ffd23f', // Bright yellow for highlights
        'wtf-dark': '#0a0a1e', // Dark navy for backgrounds
        'wtf-light': '#e5e7eb', // Light gray for text
        'wtf-success': '#06d6a0', // Green for success states
        'wtf-danger': '#ef476f', // Red for errors
        'wtf-warning': '#f78c6b', // Orange for warnings
        'wtf-bg': '#12122a', // Slightly lighter navy for cards
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          'from': { boxShadow: '0 0 5px rgba(255, 107, 53, 0.3)' },
          'to': { boxShadow: '0 0 15px rgba(255, 107, 53, 0.7)' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 107, 53, 0.5), 0 0 20px rgba(255, 107, 53, 0.3)',
        'neon-secondary': '0 0 10px rgba(0, 78, 137, 0.5), 0 0 20px rgba(0, 78, 137, 0.3)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0a0a1e 0%, #1e3a8a 100%)',
      },
    },
  },
  plugins: [],
};