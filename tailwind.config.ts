import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mint: "#18B88F",
        coral: "#F56B5F",
        plum: "#6246EA",
        cloud: "#F7F8FB",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 24, 39, 0.10)",
        panel: "0 1px 0 rgba(17, 24, 39, 0.06), 0 18px 42px rgba(17, 24, 39, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
