import {nextui} from '@nextui-org/theme'


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        default: "#FCE4EC",
        primary: "#F48FB1",
        secondary: "#B39DDB",
        success: "#14B05C",
        warning: "#FFD54F",
        danger: "#FF8A65",

        'dark-default': "#1E1E1E",
        'dark-primary': "#EC407A",
        'dark-secondary': "#9575CD",
        'dark-success': "#14B05C",
        'dark-warning': "#FFD54F",
        'dark-danger': "#FF7043",
        'dark-text': "#FFFFFF",
        'dark-muted': "#BDBDBD",
        'dark-surface': "#2C2C2E",
      },
      backgroundImage: {
        'pink-radial': 'linear-gradient(133deg, rgba(254,217,230,1) 11%, rgba(252,228,236,1) 23%, rgba(255,244,248,1) 58%, rgba(252,228,236,1) 71%, rgba(254,217,230,1) 92%);',
        'pink-radial-dark': 'linear-gradient(133deg, rgba(27,5,65,1) 1%, rgba(12,4,27,1) 7%, rgba(11,9,15,1) 58%, rgba(12,4,27,1) 88%, rgba(27,5,65,1) 98%)',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
