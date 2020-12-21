require('dotenv').config();
const nodeFetch = require('node-fetch');
const https = require('https');
const { createApi } = require('unsplash-js');
const simpleIcons = require("simple-icons");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const striptags = require("striptags");
const fs = require("fs");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
	eleventyConfig.setUseGitIgnore(false);

	eleventyConfig.setDataDeepMerge(true);

	if (process.env.ELEVENTY_PRODUCTION) {
		eleventyConfig.addTransform("htmlmin", htmlminTransform);
	} else {
		eleventyConfig.setBrowserSyncConfig({ callbacks: { ready: browserSyncReady }});
	}

	eleventyConfig.setFrontMatterParsingOptions({ excerpt: true });

	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginRss);

	eleventyConfig.addPassthroughCopy({ "_tmp/*.css": "." });
	eleventyConfig.addPassthroughCopy({ static: "." });

	eleventyConfig.addShortcode("currentyear", () => new Date().getFullYear().toString());

	eleventyConfig.addNunjucksShortcode("simpleicon", simpleIcon);

	eleventyConfig.addLiquidTag("simpleicon", simpleIconLQ);
	eleventyConfig.addLiquidTag("post_link", postLink);
	eleventyConfig.addLiquidTag("codepen", codePen);
	eleventyConfig.addLiquidTag("unsplash", unsplash);

	eleventyConfig.addFilter("readableDate", (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy"));

	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter("htmlDate", (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd'));
	
	eleventyConfig.addFilter("page", page);

	eleventyConfig.addFilter("striptags", (data) => striptags(data));
};

function browserSyncReady(err, bs) {
	bs.addMiddleware("*", (req, res) => {
		const content_404 = fs.readFileSync('_site/404.html');
		// Provides the 404 content without redirect.
		res.write(content_404);
		// Add 404 http status code in request header.
		// res.writeHead(404, { "Content-Type": "text/html" });
		res.writeHead(404);
		res.end();
	});
}

function htmlminTransform(content, outputPath) {
	if( outputPath.endsWith(".html") ) {
		let minified = htmlmin.minify(content, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true
		});
		return minified;
	}
	return content;
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

			return Promise.resolve(`<div class="text-2xl icon">${simpleIcon(id)}</div>`);
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

function unsplash(liquidEngine) {
	return {
		parse: function(tagToken, remainTokens) {
			this.args = tagToken.args;
		},
		render: async function(scope, hash) {
			let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
			let id = isQuoted ? liquidEngine.evalValue(this.args, scope) : this.args;

			const unsplash = createUnsplashClient();
			const data = await getPhotoData(unsplash, id);

			if (data.error) {
				return `<p>Unsplash error: '${data.error}' PhotoId: ${id}</p>`
			}

			const utmSource = scope.contexts[0].metadata.unsplash.utm_source;

			var dataSrc = `${data.urls.raw}&fm=webp&q=80&crop=entropy&w=1024&fit=max`;
			var dataSizes = [];
			var dataSrcSets = [];
			var sizes = [30, 100, 300, 600, 1000, 2000];
			sizes.forEach(size => {
				dataSizes.push(`(max-width: ${size}px) ${size}px`);
				dataSrcSets.push(`${data.urls.raw}&fm=webp&q=80&crop=entropy&w=${size}&fit=max ${size}w`);
			});
			dataSizes.push('600px');

			return `<figure><img class="lazyload" data-src="${dataSrc}" data-sizes="${dataSizes.join(', ')}" data-srcset="${dataSrcSets.join(', ')}" src="${data.base64}" alt="${data.alt_description}" style="background-color:${data.color}" />
<figcaption class="unsplash__credit"><p>Photo by <a href="${data.user.html}?utm_source=${utmSource}&utm_medium=referral" target="_blank" rel="noopener">${data.user.name}</a></p></figcaption>
<div class="jg-caption">📷 ${data.user.name}</div>
</figure>`;
		}
	};
}

function createUnsplashClient() {
	return createApi({
		accessKey: process.env.UNSPLASH_APP_ID,
		secret: process.env.UNSPLASH_SECRET,
		fetch: nodeFetch
	});
}

async function getBase64ImageFromUrl(imageUrl) {
	return new Promise((resolve, reject) => {
		https.get(imageUrl, (resp) => {
			resp.setEncoding('base64');
			let body = "data:" + resp.headers["content-type"] + ";base64,";
			resp.on('data', (data) => { body += data });
			resp.on('end', () => {
				resolve(body);
			});
		}).on('error', (e) => {
			reject(e);
		});
	});
}

async function getPhotoData(unsplash, id) {
	if (!id) {
		return {};
	}
	const result = await unsplash.photos.get({ photoId: id });
	if (result.errors) {
		return { error: result.errors.join() };
	}
	const json = result.response;

	const b64 = await getBase64ImageFromUrl(`${json.urls.raw}&fit=max&w=100&fm=jpg&q=10`);

	return { ...json, base64: b64 };
}

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
