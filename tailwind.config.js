/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        Appbar: '#0A0A0A',
        background: '#0E0E0E',
        backgroundVariant: '#0A0A0A',
        surface: '#131313',
        surfaceVariant: '#0E0E0E',
        primary: '#348501',
        disabled: '#505050',
        borderColor: '#1F1F1F',
        error: '#FF5050',
        success: '#348501',
        onAppbar: '#FFFFFF',
        onBackground: '#FFFFFF',
        onSurface: '#FFFFFF',
        onPrimary: '#FFFFFF',
        onDisabled: '#FFFFFF',
        onError: '#FFFFFF',
        onSuccess: '#FFFFFF',
      },
      fontFamily: {
        serif: ['serif'],
      },
    },
  },
  plugins: [],
};
