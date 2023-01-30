const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["CircularXX", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        title: ["40px", "49px"],
        heading: ["30px", "36px"],
        subheading: ["26px", "32px"],
        largeParagraph: ["18px", "25px"],
        paragraph: ["16px", "20px"],
        smallParagraph: ["14px", "20px"],
        footnote: ["12px", "15px"],
      },
      colors: {
        black: "#000000",
        white: "#ffffff",
        transparent: "transparent",
        gray: {
          DEFAULT: "#94959A",
          10: "#E6E6E6",
          30: "#B2B2B2",
          40: "#a6a6a6",
          50: "#808080",
          light: "#D1D1D6",
          darkest: "#313439",
          dark: "#4C4F56",
          /*  transparent */
          T04: "rgba(0, 0, 0, 0.04)",
          T08: "rgba(0, 0, 0, 0.08)",
          T12: "rgba(0, 0, 0, 0.12)",
          T40: "rgba(0, 0, 0, 0.4)",
          T50: "rgba(0, 0, 0, 0.5)",
        },
        orange: {
          light: "#FFEFD0",
          pastel: "#FED88A",
          DEFAULT: "#FFA437",
          dark: "#937F53",
        },
        misty: {
          10: "#EFF1F5",
          20: "#DFE7EC",
          40: "#A6B3C4",
        },
        green: {
          20: "#D5EDDC",
          DEFAULT: "#40AC74",
        },
        purple: {
          DEFAULT: "#696EE3",
          dark: "#707192",
        },
        yellow: {
          20: "#FEE4AE",
        },
        blue: {
          20: "#D8E2F7",
        },
        red: {
          60: "#E72842",
          20: "#FAD0D5",
        },
      },
      gridTemplateColumns: {
        listItemWithIcon: "40px 1fr",
        listItemWithIconAndData: "40px 1fr auto auto",
        listItemWithToggle: "40px 1fr 51px",
        listItemWithChevron: "48px 1fr 24px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
