import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fcecd6',
          200: '#f8d5ad',
          300: '#f3b679',
          400: '#ed8e43',
          500: '#e97020',
          600: '#da5716',
          700: '#b54114',
          800: '#903518',
          900: '#742e17',
          950: '#3e1409',
        },
        secondary: {
          50: '#f4f7fb',
          100: '#e8eef6',
          200: '#cbdbec',
          300: '#9dbddc',
          400: '#699ac8',
          500: '#467db2',
          600: '#356396',
          700: '#2c507a',
          800: '#284566',
          900: '#263b55',
          950: '#192638',
        },
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Noto Sans TC', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;


