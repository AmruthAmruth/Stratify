/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f7faf9',        
        surface: '#ffffff',    
        text: '#1f2937',      
        heading: '#0f172a',   
        muted: '#6b7280',      

        primary: '#16a34a',    
        primaryHover: '#15803d',

        accent: '#e5e7eb',     
      },
    },
  },
  plugins: [require("daisyui")],
}




// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         bg: '#0f172a',           // deep slate background (premium dark)
//         surface: '#111827',      // card / container surface
//         text: '#e5e7eb',         // primary text (soft white)
//         heading: '#f9fafb',      // strong headings
//         muted: '#9ca3af',        // muted text

//         primary: '#6366f1',      // premium indigo (SaaS favorite)
//         primaryHover: '#4f46e5',

//         accent: '#1f2937',       // subtle borders / dividers
//       },
//     },
//   },
//   plugins: [require("daisyui")],
// }




