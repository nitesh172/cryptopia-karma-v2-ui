/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        gradient: 'linear-gradient(180deg, #333237 0%, rgba(62, 67, 61, 0) 100%)'
      },
      colors: {
        background_color: '#090A0C',
        background_color1: '#333237',
        primary: '#30EA52',
        green1: '#04BF3C',
        green2: '#92FB94',
        popup_bg: '#202324',
        grey_bg: '#3D4143',
        error_red: '#EA3A3D'
      },
      fontFamily: {
        Jost: '"Jost"',
        Urbanist: '"Urbanist"',
        Roboto: '"Roboto"'
      }
    },
  },
  plugins: [],
}

