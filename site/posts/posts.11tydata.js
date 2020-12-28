require('dotenv').config();
const nodeFetch = require('node-fetch');
const { createApi } = require('unsplash-js');

module.exports = {
	layout: "post",
	tags: ["posts"],
	permalink: "{{title | slug}}/index.html",
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

async function getPhotoData(unsplash, id) {
	if (!id) {
		return {};
	}
	const result = await unsplash.photos.get({ photoId: id });
	if (result.errors) {
		return { error: result.errors.join() };
	}
	const json = result.response;

	return json;
}
