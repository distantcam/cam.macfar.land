require('dotenv').config();
require('isomorphic-fetch');
const Unsplash = require('unsplash-js').default;
const toJson = require("unsplash-js").toJson;
const simpleIcons = require("simple-icons");
const { DateTime } = require("luxon");
const cheerio = require("cheerio");

module.exports = function (eleventyConfig) {
	eleventyConfig.setUseGitIgnore(false);

	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addPassthroughCopy({ "_tmp/*.css": "." });
	eleventyConfig.addPassthroughCopy({ static: "." });

	eleventyConfig.addNunjucksShortcode("simpleicon", simpleIcon);
	eleventyConfig.addShortcode("currentyear", () => new Date().getFullYear().toString());
	eleventyConfig.addShortcode("excerpt", (article) => extractExcerpt(article));

	eleventyConfig.addLiquidTag("unsplash", unsplashTag);
	eleventyConfig.addLiquidTag("post_link", postlinkTag);
	eleventyConfig.addLiquidTag("simpleicon", simpleicon);

	eleventyConfig.addFilter("readableDate", (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy"));

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDate', (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd'));
};

function simpleIcon(id) {
	const data = simpleIcons.get(id);

	if (!data) {
		return `<p>SimpleIcon ID not found: '${id}'</p>`;
	}

	return `<div class="icon h-6">
	<svg width="24" height="24" data-icon="${id}" viewbox="0 0 24 24">
		<path fill="currentColor" d="${data.path}" />
	</svg>
</div>`;
}

function createUnsplashClient() {
	return new Unsplash({
		accessKey: process.env.UNSPLASH_APP_ID,
		secret: process.env.UNSPLASH_SECRET
	});
}

async function getPhotoJson(unsplash, id) {
	return await unsplash.photos.getPhoto(id).then(toJson);
}

function extractExcerpt(article) {
	if (!article.hasOwnProperty("templateContent")) {
		console.warn(
			'Failed to extract excerpt: Document has no property "templateContent".'
		);
		return null;
	}

	const $ = cheerio.load(article.templateContent);
	return $("p.lead").text();
}

function unsplashTag(liquidEngine) {
	return {
		parse: function(tagToken, remainingTokens) {
			this.str = tagToken.args;
		},
		render: function(scope, hash) {
			const str = liquidEngine.evalValue(this.str, scope);
			return Promise.resolve(`<p>${str}</p>`);
		}
	};
}

function postlinkTag(liquidEngine) {
	return {
		parse: function(tagToken, remainingTokens) {
			this.str = tagToken.args;
		},
		render: function(scope, hash) {
			const str = liquidEngine.evalValue(this.str, scope);
			return Promise.resolve(`<p>${str}</p>`);
		}
	};
}

function simpleicon(liquidEngine) {
	return {
		parse: function(tagToken, remainingTokens) {
			this.str = tagToken.args;
		},
		render: function(scope, hash) {
			const str = liquidEngine.evalValue(this.str, scope);
			return Promise.resolve(`<p>${str}</p>`);
		}
	};
}
