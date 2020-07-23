module.exports = {
	purge: {
		content: ["_site/**/*.html"],
	},
	theme: {
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
	plugins: [],
};
