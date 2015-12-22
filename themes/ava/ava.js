Ava = function() {
  this.regions = {
    header: {
      attributes: {
        foo: 'bar'
      }
    },
    content: {
      format: 'article'
    },
    footer: {}
  };
};
// Extend the DrupalGap Theme prototype.
Ava.prototype = new dg.Theme;
Ava.prototype.constructor = Ava;
