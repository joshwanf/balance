/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "waikawa-gray": "#5a698c",
        beige: "#EDECEC",
        "dark-beige": "#D9D9D9",
        prelude: "#c3b7dc",
        mischka: "#dbd1df",
        edgewater: "#bbdcce",
        peach: "#F8C8B5",
        "peach-dark": "#F39C88",
        beige2: "#F4E1D2",
        eggshell: "#E4E3D3",
        "grass-base": "#A4BBBB",
        "grass-50": "#f6f8f8",
        "grass-100": "#edf1f1",
        "grass-200": "#dbe4e4",
        "grass-300": "#c8d6d6",
        "grass-400": "#b6c9c9",
        "grass-500": "#a4bbbb",
        "grass-600": "#94a8a8",
        "grass-700": "#738383",
        "grass-800": "#525e5e",
        "grass-900": "#313838",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
}
