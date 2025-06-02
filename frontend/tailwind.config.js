/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  // corePlugins: {
  //     preflight: false,
  // },
  content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
      container: {
          center: true,
          padding: '2rem',
          screens: {
              '2xl': '1400px',
          },
      },
      extend: {
          colors: {
              gray: '#979797',
              'white-60': '#9a9ca1',
              orange: '#FB4B29',
              bg: '#1B212C',
              input: '#E0E0E0',
              black: '#2B2B2B',
              size: '#3a4046',
              pink: '#d081a5',
              money: '#FF952D',
              bg_sell: '#f6f6f6',
              gray2: '#E5E8EA',
              blue: '#33a0ff',
              star: '#E4E4E4',
              rv: '#C1C8CE',
              size2: '#99D0FF',
              buy: '#EBF6FF',
              border_sell: '#E3E6E8',
              deal: '#F6F7F8',
              bluev2: '#EBF6FF',
              bluev3: '#ADD6FA',
              cart: '#9EA0A2',
              black: '#262626',
              bluev4: '#71BDFF',
              red: '#FF4252',
              border: '#E9E9E9',
          },
          boxShadow: {
              form: '2px 2px 2px 0 rgba(0,0,0,0.2)',
              comment: '1px 1px 2px 0 rgba(0,0,0,0.2)',
          },
          keyframes: {
              'accordion-down': {
                  from: { height: 0 },
                  to: { height: 'var(--radix-accordion-content-height)' },
              },
              'accordion-up': {
                  from: { height: 'var(--radix-accordion-content-height)' },
                  to: { height: 0 },
              },
          },
          animation: {
              'accordion-down': 'accordion-down 0.2s ease-out',
              'accordion-up': 'accordion-up 0.2s ease-out',
          },
          fontFamily: {
              poppin: ['Poppins', 'sans-serif'],
              birsmark: ['Bismarck', 'sans-serif'],
              fb: ['Agency FB', 'sans-serif'],
              bak: ['Bakbak One', 'sans-serif'],
          },
      },
  },
  plugins: [require('tailwindcss-animate')],
};