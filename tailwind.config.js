/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx,html}",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      screens: { "3xl": "1920px", "4xl": "3456px" },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "blue-gradient": "linear-gradient(to right, #085AD3 50% ,#136DF1)",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-preview":
          "linear-gradient(92.19deg, rgba(9, 90, 211, 0.66) 3.29%, rgba(22, 111, 244, 0.66) 93.95%)",
        "gradient-search": `linear-gradient(0deg, #FBFDFE, #FBFDFE)`,
        "purple-gradient": `linear-gradient(92.19deg, #A045FB 3.29%, #4822E4 82.62%)`,
      },
      fontSize: {
        "xl-em": "2rem",
      },
      backgroundColor: {
        appendix: "#FFF3E7",
        blanc: "#FFFFFF8C",
        two: "#FAFBFC",
        three: "#ECF1F4",
        four: "#F0F4F6",
        five: "#F0F5FD",
        six: "#F0F5FC",
        eight: "#E6EEFB",
        "editor-white": "#FEFEFE",
        highlight: "#EEFE89",
        warn: "#DB0437",
        "warn-light": "#DB04370D",
        overlay: "#383D44",
        "auto-save": "#FFF7DB",
        save: "#D9FADB",
        var: "#FFF5FD",
        collapse: "#FBFDFE",
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        "appendix-1": "#FF7A00",
        "doc-border": "#E8F0F2",
        "black-txt": "#383D44",
        "secondary-blue": "#095AD31A",
        "hr-line": "#F0F5FD",
        "primary-blue": "#095AD3",
        "primary-gray": "#A3A7AF",
        "auto-save": "#FFC700",
        save: "#10C900",
        var: "#FF26C2",
        "disable-blu": "#095AD333",

        // border: 1px solid var(--fond-bleu-10-avec-transparence-pour-icons, #095AD31A)
      },
      boxShadow: {
        out: "0 0 10px 0.1px #F0F5FD",
        "out-md": "0px 0px 36.6px 16.37px #0337841A",
        "out-lg": "0px 0px 12px 1px #0000003B",
        "3d": "0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1)",
        "out-b": "0px 1px 15.9px 0px #095AD30D",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
