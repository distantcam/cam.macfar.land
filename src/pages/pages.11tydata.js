const { createUnsplashClient, getPhotoData } = require("../../helpers/unsplash");

module.exports = {
  layout: "page",
  tags: ["pages"],
  permalink: "{{page.fileSlug}}/index.html",
  eleventyComputed: {
    post_unsplash: async (data) => await getPhotoData(createUnsplashClient(), data.unsplash_id),
  },
};
