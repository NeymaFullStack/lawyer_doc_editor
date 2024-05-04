/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx,html}",
  ],
  theme: {
    extend: {
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
      },
      colors: {
        "black-txt": "#383D44",
        "secondary-blue": "#095AD31A",
        "hr-line": "#F0F5FD",
        "primary-blue": "#095AD3",
        "primary-gray": "#A3A7AF",
        "auto-save": "#FFC700",
        save: "#10C900",
        var: "#FF26C2",
      },
      boxShadow: {
        out: "0 0 10px 0.1px #ededed",
        "out-lg": "0px 0px 12px 1px #0000003B",
        // "in-white": "inset 0px -3px 2px 5px  #ffffff",
      },
    },
  },
  plugins: [],
};
