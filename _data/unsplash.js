require('dotenv').config();
const nodeFetch = require('node-fetch');
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

	return json;
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
