require("dotenv").config();
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const striptags = require("striptags");
const fs = require("fs");
const htmlmin = require("html-minifier");

const { simpleIcon, simpleIconLQ } = require("./helpers/simpleIcon");
const postLink = require("./helpers/postLink");
const codePen = require("./helpers/codePen");
const { unsplash } = require("./helpers/unsplash");
const cssShortcode = require("./helpers/cssShortcode");

module.exports = function (eleventyConfig) {
  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  }

  eleventyConfig.setFrontMatterParsingOptions({ excerpt: true });

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/static": "." });

  // Helpers
  eleventyConfig.addShortcode("currentyear", () =>
    new Date().getFullYear().toString()
  );
  eleventyConfig.addShortcode("css", cssShortcode);

  eleventyConfig.addNunjucksShortcode("simpleicon", simpleIcon);

  eleventyConfig.addLiquidTag("simpleicon", simpleIconLQ);
  eleventyConfig.addLiquidTag("post_link", postLink);
  eleventyConfig.addLiquidTag("codepen", codePen);
  eleventyConfig.addLiquidTag("unsplash", unsplash);

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy")
  );

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd")
  );

  eleventyConfig.addFilter("striptags", (data) => striptags(data));

  // Watch targets
  eleventyConfig.addWatchTarget("./src/styles/");

  return {
    dir: {
      input: "src",
    },
  };
};

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return content;
}
