/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',          // deep slate background
        surface: '#111827',     // cards & panels
        text: '#e5e7eb',        // primary text
        heading: '#f9fafb',     // headings
        muted: '#9ca3af',       // secondary text

        primary: '#22c55e',     // green CTA (soft neon)
        primaryHover: '#16a34a',

        accent: '#1f2937',      // borders & dividers
      },
    },
  },
  plugins: [require("daisyui")],
}
