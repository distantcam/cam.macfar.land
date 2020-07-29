module.exports = {
	purge: {
		content: ["_site/**/*.html"],
	},
	theme: {
		typography: (theme) => ({
			default: {
				css: [{
					color: "var(--color-secondary)",
					'[class~="lead"]': {
						color: "var(--color-secondary)",
					},
					a: {
						color: "var(--color-primary)",
					},
					strong: {
						color: "var(--color-secondary)",
					},
					h1: {
						color: "var(--color-secondary)",
					},
					h2: {
						color: "var(--color-secondary)",
					},
					h3: {
						color: "var(--color-secondary)",
					},
					h4: {
						color: "var(--color-secondary)",
					},
					h5: {
						color: "var(--color-secondary)",
					},
					h6: {
						color: "var(--color-secondary)",
					},
					code: {
						color: "var(--color-secondary)",
					},
				}]
			}
		}),
		extend: {
			colors: {
				primary: "var(--color-primary)",
				secondary: "var(--color-secondary)",
				main: "var(--color-main)",
				index: "var(--color-index)",
			},
			spacing: {
				"128": "32rem",
			},
			minHeight: (theme) => theme("spacing"),
			maxWidth: {
				"7xl": "80rem",
			},
		},
	},
	variants: {},
	plugins: [require("@tailwindcss/typography")],
};
