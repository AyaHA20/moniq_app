/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Inclure tous les fichiers React
  ],
  theme: {
    extend: {
      colors: {
        lightGray: "#f5f5f5", // Définit une couleur personnalisée
        darkGray: "#A9A9A9",
        
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Définir la police Inter
      },
    },
  },
  plugins: [],
};
