module.exports = {
  purge: [
		'./_site/**/*.html'
	],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
			colors: {
				primary: "#dc3545"
			},
			spacing: {
				"128": "32rem",
			},
			minHeight: (theme) => theme("spacing"),
			maxWidth: {
				"7xl": "80rem",
			},

			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme("colors.gray.700"),
						'[class~="lead"]': { color: theme("colors.gray.700") },
						a: { color: "#dc3545", "text-decoration": "none" },
						strong: { color: theme("colors.gray.700") },
						h1: { color: theme("colors.gray.700") },
						h2: { color: theme("colors.gray.700") },
						h3: { color: theme("colors.gray.700") },
						h4: { color: theme("colors.gray.700") },
						h5: { color: theme("colors.gray.700") },
						h6: { color: theme("colors.gray.700") },
						code: { color: theme("colors.gray.700") },
					}
				}, 

				dark: {
					css: {
						color: theme("colors.gray.400"),
						'[class~="lead"]': { color: theme("colors.gray.400") },
						strong: { color: theme("colors.gray.400") },
						h1: { color: theme("colors.gray.400") },
						h2: { color: theme("colors.gray.400") },
						h3: { color: theme("colors.gray.400") },
						h4: { color: theme("colors.gray.400") },
						h5: { color: theme("colors.gray.400") },
						h6: { color: theme("colors.gray.400") },
						code: { color: theme("colors.gray.400") },
					}
				}
			})
		},
  },
  variants: {
		extend: {
			typography: ["dark"],
			visibility: ['responsive', 'dark'],
		}
	},
  plugins: [require('@tailwindcss/typography')],
}
