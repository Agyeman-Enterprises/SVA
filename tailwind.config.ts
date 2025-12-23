import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sva: {
          green: "var(--sva-green)",
          "green-dark": "var(--sva-green-dark)",
          "green-light": "var(--sva-green-light)",
          "green-subtle": "var(--sva-green-subtle)",
          gold: "var(--sva-gold)",
          "gold-dark": "var(--sva-gold-dark)",
          "gold-light": "var(--sva-gold-light)",
          "gold-subtle": "var(--sva-gold-subtle)",
          cream: "var(--sva-cream)",
          "cream-dark": "var(--sva-cream-dark)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;

