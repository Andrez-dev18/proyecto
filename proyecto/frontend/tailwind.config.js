/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",       // HTML raíz
    "./**/*.html",    // HTML en subcarpetas
    "./js/**/*.js",   // Solo tu carpeta js
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


