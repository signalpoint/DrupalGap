Ava = function() {
  this.regions = {
    header: {
      _attributes: {
        foo: 'bar'
      }
    },
    content: {},
    footer: {}
  };
};
// Extend the DrupalGap Theme prototype.
Ava.prototype = new dg.Theme;
Ava.prototype.constructor = Ava;
