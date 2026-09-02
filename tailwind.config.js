/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kaspa: {
          cyan: '#70C7BA',
          glow: '#49EACB',
          dark: '#0B0F12',
          card: '#12181E',
          border: '#1E293B',
          accent: '#00F5D4',
          danger: '#FF3B30'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'burn-wipe': 'burnWipe 0.8s ease-out forwards'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(112, 199, 186, 0.4))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(112, 199, 186, 0.1))' }
        },
        burnWipe: {
          '0%': { opacity: '1', transform: 'scale(1)', filter: 'brightness(1.5) hue-rotate(0deg)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)', filter: 'brightness(2) hue-rotate(-50deg)' },
          '100%': { opacity: '0', transform: 'scale(0.95)', filter: 'brightness(0)' }
        }
      }
    },
  },
  plugins: [],
}
