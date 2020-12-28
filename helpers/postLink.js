function postLink(liquidEngine) {
  return {
    parse: function(tagToken, remainTokens) {
      this.args = tagToken.args;
    },
    render: function(scope, hash) {
      let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
      let path = isQuoted ? liquidEngine.evalValue(this.args, scope) : this.args;

      let results = scope.contexts[0].collections.posts.filter(function(tmpl) {
        return tmpl.fileSlug.endsWith(path);
      });
      if (!results.length) {
        return Promise.resolve(`<p>Slug ${path} not found</p>`);
      }
      return Promise.resolve(`<a href="${results[0].url}" title="${results[0].data.title}">${results[0].data.title}</a>`);
    }
  };
}

module.exports = postLink;
