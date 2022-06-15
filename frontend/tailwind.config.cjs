/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        secondary: {
          DEFAULT: '#4BA3B3',
          '50': '#CCE5EA',
          '100': '#BEDEE4',
          '200': '#A1CFD8',
          '300': '#84C1CC',
          '400': '#67B2BF',
          '500': '#4BA3B3',
          '600': '#3A7F8B',
          '700': '#2A5B64',
          '800': '#19373C',
          '900': '#091315'
        },
        primary: {
          DEFAULT: '#F59F0C',
          '50': '#FCE5BC',
          '100': '#FBDDA9',
          '200': '#FACD82',
          '300': '#F8BE5A',
          '400': '#F7AE33',
          '500': '#F59F0C',
          '600': '#C17408',
          '700': '#8B4F06',
          '800': '#553304',
          '900': '#1F1401'
        },
      },
    },
    plugins: [],
  }
}
