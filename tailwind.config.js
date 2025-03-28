/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        background: '#151515',
        surface: '#202020',
        secondarySurface: '#2B2B2B',
        primary: '#348501',
        onBackground: '#FFFFFF',
        onSurface: '#FFFFFF',
        onSecondarySurface: '#DDDDDD',
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
      },
      fontFamily: {
        serif: ['serif'],
      },
    },
  },
  plugins: [],
};
