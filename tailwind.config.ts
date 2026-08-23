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
          ink: '#121212',
          'ink-2': '#1c1c1c',
          red: '#c8102e',
          blue: '#005689',
          'blue-dark': '#003d61',
          paper: '#ffffff',
          mist: '#f5f5f5',
          hairline: '#dcdcdc',
          slate: '#4a4a4a',
          muted: '#6e6e6e',
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
        card: '0px',
        control: '0px',
      },
      boxShadow: {
        nav: '0 1px 3px rgba(0, 0, 0, 0.12)',
        lift: 'none',
      },
    },
  },
  plugins: [],
}
export default config
