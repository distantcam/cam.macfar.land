module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({ "_tmp/*.css": "." });
};
