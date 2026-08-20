const fetch = require("cross-fetch");
const { createApi } = require("unsplash-js");
const metadata = require("../src/_data/metadata.json");

function createUnsplashClient() {
  return createApi({
    accessKey: process.env.UNSPLASH_ACCESS,
    fetch: fetch,
  });
}

function fallbackPhotoData(id, error) {
  const fallbackUrl = `https://source.unsplash.com/${encodeURIComponent(id)}/?`;
  return {
    id,
    error,
    blur_hash: "",
    width: "",
    height: "",
    color: "#111827",
    alt_description: "Unsplash image",
    description: "Unsplash image",
    urls: {
      raw: fallbackUrl,
      regular: fallbackUrl,
      full: fallbackUrl,
    },
    user: {
      name: "Unsplash",
      username: "unsplash",
      links: {
        html: "https://unsplash.com",
      },
    },
  };
}

async function getPhotoData(unsplash, id) {
  if (!id) {
    return {};
  }
  if (!process.env.UNSPLASH_ACCESS) {
    return fallbackPhotoData(id, "Missing UNSPLASH_ACCESS");
  }
  try {
    const { data, error } = await unsplash.GET("/photos/{assetSlug}", {
      params: { path: { assetSlug: id } },
    });
    if (error) {
      return fallbackPhotoData(id, JSON.stringify(error));
    }
    return data;
  } catch (e) {
    return fallbackPhotoData(id, e.message);
  }
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

      if (data.error && (!data.urls || !data.urls.raw)) {
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
        data.description
      }" style="background-color:${
        data.color
      }" /><figcaption class="full_caption"><span>Photo by <a href="${
        data.user.links.html
      }?utm_source=${utmSource}&utm_medium=referral" target="_blank" rel="noopener">${
        data.user.name
      }</a></span></figcaption><span class="gallery_caption text-base">📷 ${
        data.user.name
        }</span></figure>`;
    },
  };
}

module.exports = { createUnsplashClient, getPhotoData, unsplash };
