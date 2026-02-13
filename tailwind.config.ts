import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          dark: '#0a0e27',
          darker: '#050812',
          purple: '#7c3aed',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#ec4899',
        }
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
        flow: 'flow 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.5', filter: 'drop-shadow(0 0 10px rgb(124, 58, 237))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgb(124, 58, 237))' },
        },
        flow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
export default config
