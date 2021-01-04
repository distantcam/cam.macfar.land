function cssShortcode(url) {
  return `<link rel="preload" href="${url}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${url}"></noscript>`;
}

module.exports = cssShortcode;
