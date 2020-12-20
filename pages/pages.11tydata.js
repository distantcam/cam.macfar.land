require('dotenv').config();
const nodeFetch = require('node-fetch');
const https = require('https');
const { createApi } = require('unsplash-js');

module.exports = {
	layout: "page",
	tags: ["pages"],
	permalink: "{{page.fileSlug}}/index.html",
	eleventyComputed: {
		post_unsplash: async (data) => await getPhotoData(createUnsplashClient(), data.unsplash_id),
	},
};

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
