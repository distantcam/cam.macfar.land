const simpleIcons = require("simple-icons");

function simpleIcon(id) {
  const data = simpleIcons['si' + id.charAt(0).toUpperCase() + id.slice(1)];

  if (!data) {
    return `<p>SimpleIcon ID not found: '${id}'</p>`;
  }

  return `<svg width="24" height="24" data-icon="${id}" viewbox="0 0 24 24"><path fill="currentColor" d="${data.path}" /></svg>`;
}

function simpleIconLQ(liquidEngine) {
  return {
    parse: function(tagToken, remainTokens) {
      this.args = tagToken.args;
    },
    render: function(scope, hash) {
      let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
      let id = isQuoted ? liquidEngine.evalValue(this.args, scope) : this.args;

      return Promise.resolve(`<div class="text-2xl icon">${simpleIcon(id)}</div>`);
    }
  };
}

module.exports = {
  simpleIcon,
  simpleIconLQ
}
