/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-background, #f7faf9)',
        surface: 'var(--color-surface, #ffffff)',
        text: 'var(--color-text, #1f2937)',
        heading: 'var(--color-heading, #0f172a)',
        muted: 'var(--color-muted, #6b7280)',

        primary: 'var(--color-primary, #16a34a)',
        primaryHover: 'var(--color-primary-hover, #15803d)',

        accent: 'var(--color-accent, #e5e7eb)',
        borderColor: 'var(--color-border, #e5e7eb)',
      },
    },
  },
  plugins: [require("daisyui")],
}






