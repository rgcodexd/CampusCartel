import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        ink: "hsl(var(--ink))",
        mint: "hsl(var(--mint))",
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(16, 24, 40, 0.15)",
        floating: "0 10px 40px -10px rgba(90, 40, 229, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;

