/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0a1e',          // deep midnight purple
        surface: '#14132e',     // cards & panels
        text: '#e6e6f0',        // soft off-white text
        heading: '#ffffff',    // headings
        muted: '#9a9ab5',       // muted lavender-gray

        primary: '#8b5cf6',     // vibrant purple CTA
        primaryHover: '#7c3aed',

        accent: '#23224a',      // borders & dividers
      },
    },
  },
  plugins: [require("daisyui")],
}
