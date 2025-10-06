/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.htm",            // current folder
    "./**/*.htm",         // all subfolders
    "./login/*.htm",
    "./login/showPassword.htm", // explicitly include other folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
