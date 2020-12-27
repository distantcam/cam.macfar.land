const colors = require('tailwindcss/colors')

module.exports = {
	purge: {
		content: [
			'./_includes/**/*.njk',
			'./index.njk'
		],
	},
	darkMode: 'class', // false or 'media' or 'class'
	theme: {
		fontFamily: {
      sans: ["Open Sans", 'sans-serif'],
    },
		fontSize: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '4rem',
		},
		extend: {
			colors: {
				primary: colors.rose[600]
			},
			spacing: {
				"128": "32rem",
			},
			minHeight: (theme) => theme("spacing"),
			maxWidth: {
				"7xl": "80rem",
				"prose-xl": "80ch"
			},

			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme("colors.gray.700"),
						a: { color: colors.rose[600], "text-decoration": "none" },
						strong: { color: theme("colors.gray.700") },
						h1: { color: theme("colors.gray.700") },
						h2: { color: theme("colors.gray.700") },
						h3: { color: theme("colors.gray.700") },
						h4: { color: theme("colors.gray.700") },
						h5: { color: theme("colors.gray.700") },
						h6: { color: theme("colors.gray.700") },
						code: {
							color: theme("colors.gray.700"),
							background: colors.blueGray[100],
							'font-family': 'Fira Code, monospace',
							'font-weight': 300
						},
						'code::before': {
							content: 'none',
						},
						'code::after': {
							content: 'none',
						},
					}
				}, 

				dark: {
					css: {
						color: theme("colors.gray.400"),
						strong: { color: theme("colors.gray.400") },
						h1: { color: theme("colors.gray.400") },
						h2: { color: theme("colors.gray.400") },
						h3: { color: theme("colors.gray.400") },
						h4: { color: theme("colors.gray.400") },
						h5: { color: theme("colors.gray.400") },
						h6: { color: theme("colors.gray.400") },
						code: { color: theme("colors.gray.400"), background: colors.warmGray[900] },
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
