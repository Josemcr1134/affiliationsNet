const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        screens: {
            xs: "250px",
            ...defaultTheme.screens,
        },
        extend: {
            colors: {
                cyan: colors.cyan,
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
