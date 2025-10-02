/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
	  fontFamily: {
              kode: ["'Kode Mono'", "monospace"], 
	      caveat: ["Caveat", "cursive"],
	      roboto: ["'Roboto'", "sans-serif"],  // clean UI fallback
	      gloria: ['"Gloria Hallelujah"', 'cursive'],
	  },
	  fontWeight: {
	      thin: 100,
	      extraLight: 200,
	      light: 300,
	      normal: 400,
	      medium: 500,
	      semibold: 600,
	      bold: 700,
	      extrabold: 800,
	      black: 900,
	  },
	  colors: {
	      green4g: {
		  100: "#008b00",
		  200: "#199619",
		  300: "#32a232",
		  400: "#4cad4c",
		  500: "#66b966",
		  600: "#7fc47f",
		  700: "#99d099",
		  800: "#b2dcb2",
		  900: "#cce7cc",
		  1000: "#e5f3e5",
	      },
	      blue3g: {
		  100: "#0000cd",
		  200: "#1919d2",
		  300: "#3232d7",
		  400: "#4c4cdc",
		  500: "#6666e1",
		  600: "#7f7fe6",
		  700: "#9999eb",
		  800: "#b2b2f0",
		  900: "#ccccf5",
		  1000: "#e5e5fa",
	      },
	  },
	  fontSize: {
	      'tp1': ['25pt', { lineHeight: '1.2', fontWeight: '100', letterSpacing: '0em' }],
	      'db1': ['40pt', { lineHeight: '1.2', fontWeight: '100', letterSpacing: '0em' }],
	      'db2': ['30pt', { lineHeight: '1.2', fontWeight: '100', letterSpacing: '0em' }],
	  },
      },
  },
  plugins: [require("daisyui")],
}

