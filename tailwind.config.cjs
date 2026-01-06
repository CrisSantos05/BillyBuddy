/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#137fec",
                secondary: "#ee8c2b",
                "background-dark": "#101922",
                "surface-dark": "#1c242d",
                "border-dark": "#3b4754"
            },
            fontFamily: {
                sans: ["Plus Jakarta Sans", "Manrope", "sans-serif"],
                display: ["Manrope", "sans-serif"]
            }
        },
    },
    plugins: [],
}
