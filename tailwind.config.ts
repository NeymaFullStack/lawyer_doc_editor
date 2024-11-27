import type { Config } from "tailwindcss";

export const iconColors = {
  from: "#095AD3",
  "light-blue": "#CEDEF6",
  white: "#fff",
  to: "#166FF4",
  gray: "#383D44",
  "light-gray": "#A3A7AF",
  "pink-from": "#A045FB",
  "pink-to": "#4822E4",
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

        // Logan Gradient variant
        "primary-gradient":
          "linear-gradient(99.54deg, #095AD3 0.47%, #166FF4 98.19%)",
        "pink-gradient":
          "linear-gradient(92.19deg, #A045FB 3.29%, #4822E4 82.62%)",
      },
      borderRadius: {
        large: "10px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderImage: {
        "long-dash":
          "repeating-linear-gradient(90deg, black 0px, black 10px, transparent 10px, transparent 20px) 1",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "#fff",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // Logan Color Palette
        logan: {
          primary: {
            50: "#D9D9D9E0",
            100: "#FBFDFE",
            200: "#F0F5FC",
            300: "#095AD31A",
            400: "#CEDEF6",
            500: "#293038",
          },
          black: {
            DEFAULT: "#383D44",
            foreground: "#A3A7AF",
          },
          green: {
            DEFAULT: "#10C900",
            foreground: "#D9FADB",
          },
          cyan: {
            DEFAULT: "#01C0DB",
            foreground: "#E4FAFD",
          },
          pink: {
            DEFAULT: "#FF26C2",
            foreground: "#FFF5FD",
          },
          orange: {
            DEFAULT: "#FF7A00",
            foreground: "#FFF3E7",
          },
          blue: {
            DEFAULT: "#095AD3",
            foreground: "#F0F5FC",
          },
          yellow: {
            DEFAULT: "#FFC700",
            foreground: "#FFF7DB",
          },
          warn: {
            DEFAULT: "#DB0437",
            foreground: "#FDF2F5",
          },
          highlight: "#EEFE89",
        },
      },
      boxShadow: {
        "badge-sm": "0px 0px 12px 1px #0854C626",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        smaller: "13px",
      },
      width: {
        "125": "500px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
