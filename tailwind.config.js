/** @type {import('tailwindcss').Config} */
/**
 * Tailwind Configuration
 *
 * Material 3 Expressive theme with custom color tokens, typography, and utilities.
 * Colors reference CSS variables for dynamic theming (light/dark mode).
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          container: "rgb(var(--color-primary-container) / <alpha-value>)",
          on: "rgb(var(--color-on-primary) / <alpha-value>)",
          "on-container":
            "rgb(var(--color-on-primary-container) / <alpha-value>)",
          light: "#7f67be",
          dark: "#4f378b",
        },
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        "on-primary-container":
          "rgb(var(--color-on-primary-container) / <alpha-value>)",

        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          container: "rgb(var(--color-secondary-container) / <alpha-value>)",
          on: "rgb(var(--color-on-secondary) / <alpha-value>)",
          "on-container":
            "rgb(var(--color-on-secondary-container) / <alpha-value>)",
          light: "#ff8ab0",
          dark: "#e5527b",
        },
        "on-secondary": "rgb(var(--color-on-secondary) / <alpha-value>)",
        "on-secondary-container":
          "rgb(var(--color-on-secondary-container) / <alpha-value>)",

        tertiary: {
          DEFAULT: "rgb(var(--color-tertiary) / <alpha-value>)",
          container: "rgb(var(--color-tertiary-container) / <alpha-value>)",
          on: "rgb(var(--color-on-tertiary) / <alpha-value>)",
          "on-container":
            "rgb(var(--color-on-tertiary-container) / <alpha-value>)",
          light: "#00d4b5",
          dark: "#00a690",
        },
        "on-tertiary": "rgb(var(--color-on-tertiary) / <alpha-value>)",
        "on-tertiary-container":
          "rgb(var(--color-on-tertiary-container) / <alpha-value>)",

        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          container: "rgb(var(--color-success-container) / <alpha-value>)",
          on: "rgb(var(--color-on-success) / <alpha-value>)",
          "on-container":
            "rgb(var(--color-on-success-container) / <alpha-value>)",
        },
        "on-success": "rgb(var(--color-on-success) / <alpha-value>)",
        "on-success-container":
          "rgb(var(--color-on-success-container) / <alpha-value>)",

        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          container: "rgb(var(--color-error-container) / <alpha-value>)",
          on: "rgb(var(--color-on-error) / <alpha-value>)",
          "on-container":
            "rgb(var(--color-on-error-container) / <alpha-value>)",
        },
        "on-error": "rgb(var(--color-on-error) / <alpha-value>)",
        "on-error-container":
          "rgb(var(--color-on-error-container) / <alpha-value>)",

        background: {
          DEFAULT: "rgb(var(--color-background) / <alpha-value>)",
        },
        "on-background": "rgb(var(--color-on-background) / <alpha-value>)",

        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          variant: "rgb(var(--color-surface-variant) / <alpha-value>)",
          container: "rgb(var(--color-surface-container) / <alpha-value>)",
          "container-high":
            "rgb(var(--color-surface-container-high) / <alpha-value>)",
          "container-low":
            "rgb(var(--color-surface-container-low) / <alpha-value>)",
        },
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant":
          "rgb(var(--color-on-surface-variant) / <alpha-value>)",

        outline: {
          DEFAULT: "rgb(var(--color-outline) / <alpha-value>)",
          variant: "rgb(var(--color-outline-variant) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        xl: "1.5rem",
        "2xl": "2.5rem",
        "3xl": "3.5rem",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #ff6b9d 0%, #c239b3 100%)",
        "gradient-tertiary":
          "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
        "gradient-warm": "linear-gradient(135deg, #ffb75e 0%, #ed8f03 100%)",
        "gradient-cool": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      },
      boxShadow: {
        "elevation-1": "0 2px 8px rgba(103, 80, 164, 0.12)",
        "elevation-2": "0 4px 16px rgba(103, 80, 164, 0.15)",
        "elevation-3": "0 8px 32px rgba(103, 80, 164, 0.18)",
        "elevation-4": "0 16px 48px rgba(103, 80, 164, 0.22)",
        "glow-primary": "0 8px 24px rgba(103, 80, 164, 0.3)",
      },
    },
  },
  plugins: [],
};
