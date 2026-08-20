const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { createApi } = require("unsplash-js");
const metadata = require("../src/_data/metadata.json");

const CACHE_DIR = path.join(__dirname, "..", ".cache", "unsplash");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const inFlight = new Map();

function cachePath(id) {
  return path.join(CACHE_DIR, crypto.createHash("sha1").update(id).digest("hex") + ".json");
}

function readCache(id) {
  try {
    const file = cachePath(id);
    if (Date.now() - fs.statSync(file).mtimeMs > CACHE_TTL_MS) {
      return null;
    }
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return null;
  }
}

function writeCache(id, data) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePath(id), JSON.stringify(data));
  } catch (e) {
    // A cache write must never fail the build.
  }
}

function escapeHtml(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createUnsplashClient() {
  return createApi({
    accessKey: process.env.UNSPLASH_ACCESS,
  });
}

async function fetchPhotoData(unsplash, id) {
  const cached = readCache(id);
  if (cached) {
    return cached;
  }
  try {
    const { data, error } = await unsplash.GET("/photos/{assetSlug}", {
      params: { path: { assetSlug: id } },
    });
    if (error) {
      return { error: JSON.stringify(error) };
    }
    writeCache(id, data);
    return data;
  } catch (e) {
    return { error: e.message };
  }
}

function getPhotoData(unsplash, id) {
  if (!id) {
    return Promise.resolve({});
  }
  if (!inFlight.has(id)) {
    inFlight.set(id, fetchPhotoData(unsplash, id));
  }
  return inFlight.get(id);
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
        return `<p>Unsplash error: '${escapeHtml(data.error)}' PhotoId: ${escapeHtml(id)}</p>`;
      }

      const utmSource = metadata.unsplash.utm_source;

      var dataSrc = `${data.urls.raw}${metadata.unsplash.common_query}&w=1024`;
      var dataSrcSets = [];
      metadata.unsplash.sizes.forEach((size) => {
        dataSrcSets.push(
          `${data.urls.raw}${metadata.unsplash.common_query}&w=${size} ${size}w`
        );
      });

      return `<figure><img class="blurhash lazyload" data-blurhash="${
        escapeHtml(data.blur_hash)
      }" data-width="${data.width}" data-height="${
        data.height
        }" data-src="${dataSrc}" data-sizes="auto" data-srcset="${dataSrcSets.join(
          ", "
      )}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="${
        escapeHtml(data.alt_description)
      }" style="background-color:${
        escapeHtml(data.color)
      }" /><figcaption class="full_caption"><span>Photo by <a href="${
        data.user.links.html
      }?utm_source=${utmSource}&utm_medium=referral" target="_blank" rel="noopener">${
        escapeHtml(data.user.name)
      }</a></span></figcaption><span class="gallery_caption text-base">📷 ${
        escapeHtml(data.user.name)
        }</span></figure>`;
    },
  };
}

module.exports = { createUnsplashClient, getPhotoData, unsplash };
