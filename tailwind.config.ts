import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        Urbanist: ['var(--font-urbanist)'],
        Jost: ["var(--font-jost)"],
        Roboto: ["var(--font-roboto)"],
        Orbitron: ["var(--font-orbitron)"],
      }
    },
  },
  plugins: [],
};
export default config;
