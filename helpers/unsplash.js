const fetch = require("cross-fetch");
const { createApi } = require("unsplash-js");
const metadata = require("../src/_data/metadata.json");

function createUnsplashClient() {
  return createApi({
    accessKey: process.env.UNSPLASH_APP_ID,
    secret: process.env.UNSPLASH_SECRET,
    fetch: fetch,
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

function unsplash(liquidEngine) {
  return {
    parse: function (tagToken, remainTokens) {
      this.args = tagToken.args;
    },
    render: async function (scope, hash) {
      let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
      let id = isQuoted ? liquidEngine.evalValue(this.args, scope) : this.args;

      const unsplash = createUnsplashClient();
      const data = await getPhotoData(unsplash, id);

      if (data.error) {
        return `<p>Unsplash error: '${data.error}' PhotoId: ${id}</p>`;
      }

      const utmSource = metadata.unsplash.utm_source;

      var dataSrc = `${data.urls.raw}${metadata.unsplash.common_query}&w=1024`;
      var dataSizes = [];
      var dataSrcSets = [];
      metadata.unsplash.sizes.forEach((size) => {
        dataSizes.push(`(max-width: ${size}px) ${size}px`);
        dataSrcSets.push(
          `${data.urls.raw}${metadata.unsplash.common_query}&w=${size} ${size}w`
        );
      });
      dataSizes.push("600px");

      return `<figure><img class="blurhash lazyload" data-blurhash="${
        data.blur_hash
      }" data-width="${data.width}" data-height="${
        data.height
      }" data-src="${dataSrc}" data-sizes="${dataSizes.join(
        ", "
      )}" data-srcset="${dataSrcSets.join(
        ", "
      )}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="${
        data.alt_description
      }" style="background-color:${
        data.color
      }" /><figcaption class="full_caption"><span>Photo by <a href="${
        data.user.html
      }?utm_source=${utmSource}&utm_medium=referral" target="_blank" rel="noopener">${
        data.user.name
      }</a></span></figcaption><span class="gallery_caption text-base">📷 ${
        data.user.name
      }</span></figure>`;
    },
  };
}

module.exports = { createUnsplashClient, getPhotoData, unsplash };
