

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // if using /app directory
  ],
  theme: {
     extend:{
      fontFamily:{
        sans: ['var(--font-ubuntu)', 'sans-serif'],
      }
     }
  },
  plugins: [],
  corePlugins:{
    preflight:true,
  }
};
