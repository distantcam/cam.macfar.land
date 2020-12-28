const { createUnsplashClient, getPhotoData } = require("../../helpers/unsplash");
const metadata = require("./metadata.json");

module.exports = async function() {
  const unsplash = createUnsplashClient();

  const unsplash_default = await getPhotoData(unsplash, metadata.unsplash.default_id);
  const unsplash_default_dark = await getPhotoData(unsplash, metadata.unsplash.default_dark_id);

  return {
    "default": unsplash_default,
    "default_dark": unsplash_default_dark
  }
};
