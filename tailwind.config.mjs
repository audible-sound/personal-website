/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#E7E7E7",
					dark: "#000000",
					blue: "#7f96ff"
				},
				secondary: {
					light: "#D0D0D0",
					dark: "#1A1A1A"
				},
				logo: {
					green: "#57BF37"
				}
			},
			fontFamily: {
				"mulish": ["Mulish", "serif"]
			},
			backgroundImage: {
				'gradient-light': 'linear-gradient(to bottom, #E7E7E7, #F0F0F0, #E7E7E7)',
				'gradient-dark': 'linear-gradient(to bottom, #000000, #0C0C0C, #000000)',
			}
		}
	},
	plugins: [],
}
