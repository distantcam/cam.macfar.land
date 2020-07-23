const simpleIcons = require("simple-icons");

module.exports = function (eleventyConfig) {
	eleventyConfig.setUseGitIgnore(false);

	eleventyConfig.addPassthroughCopy({ "_tmp/*.css": "." });

	eleventyConfig.addShortcode("simpleicon", simpleIcon);
};

function simpleIcon(id) {
	const data = simpleIcons.get(id);

	if (!data) {
		return `<p>SimpleIcon ID not found: '${id}'</p>`;
	}

	return `<div class="icon">
	<svg width="24" height="24" data-icon="${id}" viewbox="0 0 24 24">
		<path fill="currentColor" d="${data.path}" />
	</svg>
</div>`;
}
