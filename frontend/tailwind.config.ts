import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1c2f",
        mist: "#e6f0ff",
        ember: "#f45d48",
        mint: "#00a878",
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(16, 24, 40, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
