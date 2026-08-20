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
        asn: {
          ink: '#0f1419',
          'ink-2': '#171e26',
          red: '#c8102e',
          'red-dark': '#9d0b23',
          paper: '#ffffff',
          mist: '#f6f7f9',
          hairline: '#dfe3e9',
          slate: '#47515e',
          muted: '#6b7480',
        },
      },
      fontFamily: {
        sans: ['var(--font-ui)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-ui)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        masthead: ['var(--font-ui)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['var(--font-editorial)', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        broadsheet: '1280px',
      },
      borderRadius: {
        card: '10px',
        control: '6px',
      },
      boxShadow: {
        nav: '0 2px 8px rgba(15, 20, 25, 0.07), 0 1px 2px rgba(15, 20, 25, 0.04)',
        lift: '0 10px 28px rgba(15, 20, 25, 0.1), 0 2px 6px rgba(15, 20, 25, 0.05)',
      },
    },
  },
  plugins: [],
}
export default config
