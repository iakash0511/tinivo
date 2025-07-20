import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9D7EDB",
        lightBg: "#FFF8F0",
        accent1: "#FFB7D5",
        accent2: "#A2D2FF",
        neutralDark: "#333333",
        neutralLight: "#F5F5F5",
      },
      fontFamily: {
        logo: ["'Poppins'", "sans-serif"],
        heading: ["'Raleway'", "sans-serif"],
        body: ["'Nunito'", "sans-serif"],
        cta: ["'Quicksand'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
