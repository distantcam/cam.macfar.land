require('dotenv').config();
require('isomorphic-fetch');
const Unsplash = require('unsplash-js').default;
const toJson = require("unsplash-js").toJson;
const https = require('https');

module.exports = {
	layout: "post",
	"tags": ["posts"],
  eleventyComputed: {
    post_unsplash: async (data) => await getPhotoData(createUnsplashClient(), data.unsplash_id),
  },
};

function createUnsplashClient() {
	return new Unsplash({
		accessKey: process.env.UNSPLASH_APP_ID,
		secret: process.env.UNSPLASH_SECRET
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
	const json = await unsplash.photos.getPhoto(id).then(toJson);
	if (json.errors) {
		return { error: json.errors.join() };
	}

	const b64 = await getBase64ImageFromUrl(`${json.urls.raw}&fit=max&w=100&fm=jpg&q=10`);

	return { ...json, base64: b64 };
}
