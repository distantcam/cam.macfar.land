function codePen(liquidEngine) {
  return {
    parse: function(tagToken, remainTokens) {
      this.args = tagToken.args;
    },
    render: function(scope, hash) {
      let isQuoted = this.args.charAt(0) === "'" || this.args.charAt(0) === '"';
      let args = isQuoted ? liquidEngine.evalValue(this.args, scope).split(',') : this.args.split(',');

      var user = args[0].trim();
      var token = args[1].trim();

      return Promise.resolve(`<p class="codepen" data-user="${user}" data-slug-hash="${token}" data-default-tab="}&lt;&#x2F;p&gt;" data-theme-id="dark" data-height="512" style="height: 512px"><span>See the <a href="https://codepen.io/${user}/pen/${token}" target="_blank" rel="noopener">CodePen</a></span></p>`);
    }
  };
}

module.exports = codePen;
