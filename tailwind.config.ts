import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
        display: ['"Ceviche One"', "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sunflower: {
          DEFAULT: "hsl(var(--sunflower))",
          light: "hsl(var(--sunflower-light))",
        },
        mint: {
          DEFAULT: "hsl(var(--mint))",
          light: "hsl(var(--mint-light))",
        },
        coral: {
          DEFAULT: "hsl(var(--coral))",
          light: "hsl(var(--coral-light))",
        },
        sky: {
          DEFAULT: "hsl(var(--sky))",
          light: "hsl(var(--sky-light))",
          bg: "hsl(var(--sky-bg))",
        },
        island: {
          sand: "hsl(var(--island-sand))",
          "sand-light": "hsl(var(--island-sand-light))",
          "sand-bright": "hsl(var(--island-sand-bright))",
          turquoise: "hsl(var(--island-turquoise))",
          "turquoise-light": "hsl(var(--island-turquoise-light))",
          "turquoise-glow": "hsl(var(--island-turquoise-glow))",
          magenta: "hsl(var(--island-magenta))",
          "magenta-light": "hsl(var(--island-magenta-light))",
          jungle: "hsl(var(--island-jungle))",
          "jungle-light": "hsl(var(--island-jungle-light))",
          fire: "hsl(var(--island-fire))",
          "fire-light": "hsl(var(--island-fire-light))",
          palm: "hsl(var(--island-palm))",
          "palm-light": "hsl(var(--island-palm-light))",
          bone: "hsl(var(--island-bone))",
          parchment: "hsl(var(--island-parchment))",
          "parchment-dark": "hsl(var(--island-parchment-dark))",
          wood: "hsl(var(--island-wood))",
          "wood-light": "hsl(var(--island-wood-light))",
          stone: "hsl(var(--island-stone))",
        },
        cobalt: {
          DEFAULT: "hsl(var(--cobalt))",
          light: "hsl(var(--cobalt-light))",
        },
        tangerine: {
          DEFAULT: "hsl(var(--tangerine))",
          light: "hsl(var(--tangerine-light))",
        },
        neon: {
          green: "hsl(var(--neon-green))",
          "green-light": "hsl(var(--neon-green-light))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.08)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "coin-pop": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "50%": { transform: "translateY(-30px) scale(1.3)", opacity: "1" },
          "100%": { transform: "translateY(-50px) scale(0.8)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "bounce-in": "bounce-in 0.5s ease-out",
        "coin-pop": "coin-pop 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
