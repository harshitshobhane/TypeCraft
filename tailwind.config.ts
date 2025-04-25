
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(to right, rgb(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--primary) / 0.1) 1px, transparent 1px)',
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgb(var(--primary) / 0.15), transparent 70%)',
      },
      backgroundSize: {
        'grid': '30px 30px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'matrix-text': 'matrix-text 10s linear infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgb(var(--primary) / 0.5)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgb(var(--primary) / 0.7)',
            transform: 'scale(1.02)'
          },
        },
        'matrix-text': {
          '0%': { 
            textShadow: '0 0 5px rgb(var(--primary) / 0.8), 0 0 10px rgb(var(--primary) / 0.4)' 
          },
          '50%': { 
            textShadow: '0 0 15px rgb(var(--primary) / 1), 0 0 20px rgb(var(--primary) / 0.6)' 
          },
          '100%': { 
            textShadow: '0 0 5px rgb(var(--primary) / 0.8), 0 0 10px rgb(var(--primary) / 0.4)' 
          },
        },
        'tilt': {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
