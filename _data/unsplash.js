require('dotenv').config();
const nodeFetch = require('node-fetch');
const https = require('https');
const { createApi } = require('unsplash-js');
const metadata = require("./metadata.json");

function createUnsplashClient() {
	return createApi({
		accessKey: process.env.UNSPLASH_APP_ID,
		secret: process.env.UNSPLASH_SECRET,
		fetch: nodeFetch
	});
}

async function getPhotoData(unsplash, id) {
	if (!id) {
		return {};
	}
	const result = await unsplash.photos.get({ photoId: id });
	if (result.errors) {
		return json.errors.join();
	}
	const json = result.response;

	const b64 = await getBase64ImageFromUrl(`${json.urls.raw}&fit=max&w=100&fm=jpg&q=10`);

	return { ...json, base64: b64 };
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

module.exports = async function() {
	const unsplash = createUnsplashClient();

	const unsplash_default = await getPhotoData(unsplash, metadata.unsplash.default_id);
	const unsplash_default_dark = await getPhotoData(unsplash, metadata.unsplash.default_dark_id);

	return {
		"default": unsplash_default,
		"default_dark": unsplash_default_dark
	}
};
