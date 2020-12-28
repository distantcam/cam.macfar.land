const { createUnsplashClient, getPhotoData } = require("../../helpers/unsplash");

module.exports = {
  layout: "post",
  tags: ["posts"],
  permalink: "{{title | slug}}/index.html",
  eleventyComputed: {
    post_unsplash: async (data) => await getPhotoData(createUnsplashClient(), data.unsplash_id),
  },
};
