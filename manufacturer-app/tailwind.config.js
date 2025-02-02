export default {
  content: ["./src/**/*.tsx", "./src/**/*.css"],
  plugins: [require("@tailwindcss/forms")],
  theme: {
    extend: {
      fontFamily: {
        dmSans: ["DM Sans", "sans-serif"],
        darkerGrotesque: ["Darker Grotesque", "sans-serif"],
      },
    },
  },
};
