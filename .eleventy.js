require('dotenv').config();
require('isomorphic-fetch');
const Unsplash = require('unsplash-js').default;
const toJson = require("unsplash-js").toJson;
const simpleIcons = require("simple-icons");
const { DateTime } = require("luxon");
const cheerio = require("cheerio");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
	eleventyConfig.setUseGitIgnore(false);

	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.addPassthroughCopy({ "_tmp/*.css": "." });
	eleventyConfig.addPassthroughCopy({ static: "." });

	eleventyConfig.addShortcode("currentyear", () => new Date().getFullYear().toString());
	eleventyConfig.addShortcode("excerpt", extractExcerpt);

	eleventyConfig.addShortcode("unsplash", dummy);

	eleventyConfig.addNunjucksShortcode("simpleicon", simpleIcon);

	eleventyConfig.addLiquidTag("simpleicon", simpleIconLQ);
	eleventyConfig.addLiquidTag("post_link", postLink);
	eleventyConfig.addLiquidTag("codepen", codePen);

	eleventyConfig.addFilter("readableDate", (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy"));

	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter("htmlDate", (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd'));
	
	eleventyConfig.addFilter("page", page);
};

function dummy() {
	return "<span>[Dummy]</span>"
}

function simpleIcon(id) {
	const data = simpleIcons.get(id);

	if (!data) {
		return `<p>SimpleIcon ID not found: '${id}'</p>`;
	}

	return `<svg width="24" height="24" data-icon="${id}" viewbox="0 0 24 24"><path fill="currentColor" d="${data.path}" /></svg>`;
}

function simpleIconLQ(liquidEngine) {
	return {
		parse: function(tagToken, remainTokens) {
			this.args = tagToken.args;
		},
		render: function(scope, hash) {
			let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
			let id = isQuoted ? liquidEngine.evalValue(this.args, scope) : this.args;

			return Promise.resolve(`<div class="icon">${simpleIcon(id)}</div>`);
		}
	};
}

function postLink(liquidEngine) {
	return {
		parse: function(tagToken, remainTokens) {
			this.args = tagToken.args;
		},
		render: function(scope, hash) {
			let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
			let path = isQuoted ? liquidEngine.evalValue(this.args, scope) : this.args;

			let results = scope.contexts[0].collections.posts.filter(function(tmpl) {
				return tmpl.fileSlug.endsWith(path);
			});
			if (!results.length) {
				return Promise.resolve(`<p>Slug ${path} not found</p>`);
			}
			return Promise.resolve(`<a href="${results[0].url}" title="${results[0].data.title}">${results[0].data.title}</a>`);
		}
	};
}

function codePen(liquidEngine) {
	return {
		parse: function(tagToken, remainTokens) {
			this.args = tagToken.args;
		},
		render: function(scope, hash) {
			let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
			let args = isQuoted ? liquidEngine.evalValue(this.args, scope).split(',') : this.args.split(',');

			var user = args[0].trim();
			var token = args[1].trim();

			return Promise.resolve(`<p class="codepen" data-user="${user}" data-slug-hash="${token}" data-default-tab="}&lt;&#x2F;p&gt;" data-theme-id="dark" data-height="512" style="height: 512px"><span>See the <a href="https://codepen.io/${user}/pen/${token}" target="_blank" rel="noopener">CodePen</a></span></p>`);
		}
	};
}

// function createUnsplashClient() {
// 	return new Unsplash({
// 		accessKey: process.env.UNSPLASH_APP_ID,
// 		secret: process.env.UNSPLASH_SECRET
// 	});
// }

// async function getPhotoJson(unsplash, id) {
// 	return await unsplash.photos.getPhoto(id).then(toJson);
// }

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

// function unsplash(id)
// {
// 	return `<p>Unsplash ${id}</p>`
// }

// function unsplashTag(liquidEngine) {
// 	return {
// 		parse: function(tagToken, remainingTokens) {
// 			this.str = tagToken.args;
// 		},
// 		render: function(scope, hash) {
// 			const str = liquidEngine.evalValue(this.str, scope);
// 			return Promise.resolve(`<p>Unsplash: ${str}</p>`);
// 		}
// 	};
// }

function page(array, n, p) {
	var from = n * p * -1;
	var to = n * (p - 1) * -1;
	let page;
	if (to == 0) {
		page = array.slice(from);
	} else {
		page = array.slice(from, to);
	}
	page.reverse();
	return page;
}
