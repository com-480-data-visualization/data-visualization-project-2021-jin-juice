module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height:{
        'screen-50':'50vh',
        'screen-2/3':'66vh',
        'screen-4/5':'80vh'
      },
      colors:{
        'dark':'#021f4d',
        'darkest':'#041838',
        'highlight':'#b32134',
        'highlight-400':'#cf364a',
        'green-chart': '#28B463',
        'red-chart': '#d53e4f',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),],
}
