/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blackcolor: "var(--black-color)",
        redcolor: "var(--red-color)",
        easycolor: "var(--green-color)",
        mediumcolor: "var(--dark-grey-color)",
        hardcolor: "var(--red-color)",
        whitecolor: "var(--white-color)",
        lightgreycolor: "var(--light-grey-color)",
        greycolor: "var(--grey-color)",
        darkgreycolor: "var(--dark-grey-color)",
        greencolor: "var(--green-color)",
      },
    },
  },
  plugins: [],
};
