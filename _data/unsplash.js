require('dotenv').config();
require('isomorphic-fetch');
const Unsplash = require('unsplash-js').default;
const toJson = require("unsplash-js").toJson;

const unsplash_default_id = "q10VITrVYUM";
const unsplash_default_dark_id = "0gkw_9fy0eQ";

function createUnsplashClient() {
	return new Unsplash({
		accessKey: process.env.UNSPLASH_APP_ID,
		secret: process.env.UNSPLASH_SECRET
	});
}

async function getPhotoJson(unsplash, id) {
	const json = await unsplash.photos.getPhoto(id).then(toJson);
	if (json.errors) {
		throw json.errors.join();
	}
	return json;
}

module.exports = async function() {
	const unsplash = createUnsplashClient();

	const unsplash_default = await getPhotoJson(unsplash, unsplash_default_id);
	const unsplash_default_dark = await getPhotoJson(unsplash, unsplash_default_dark_id);

	return {
		"default": unsplash_default,
		"default_dark": unsplash_default_dark
	}
};
