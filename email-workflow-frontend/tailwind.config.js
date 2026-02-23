/** @type {import('tailwindcss').Config} */

module.exports = {

  content: [

    "./app/**/*.{js,ts,jsx,tsx}",

    "./components/**/*.{js,ts,jsx,tsx}",

  ],

  theme: {

    container: {

      center: true,

      padding: "24px",

    },

    extend: {

      colors: {

        background: "#f8fafc",

        card: "#ffffff",

        primary: "#2563eb",

        border: "#e2e8f0",

        text: "#0f172a",

        muted: "#64748b",

      },

      boxShadow: {

        card:

          "0 4px 20px rgba(0,0,0,0.05)",

        cardHover:

          "0 10px 30px rgba(0,0,0,0.08)",

      },

      borderRadius: {

        xl: "14px",

      },

    },

  },

  plugins: [],

}