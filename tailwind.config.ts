import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class'],
  theme: {
    extends: {
      keyframes: {
        fade: {
          '0%': { opacity: 0, transform: 'translateY(24)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        fade: 'fade 0.3s ease-in-out'
      }
    }
  },
  plugins: []
}
export default config
