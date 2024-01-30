/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  "./*.{html,js}",
  "./pages/**/*.html",
  "./node_modules/flowbite/**/*.js",
],
  theme: {
    extend: {
      backgroundImage: {
        'main': "url('/assets/Background.png')",
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}

