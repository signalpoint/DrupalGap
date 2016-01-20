Ava = function() {
  this.regions = {
    header: { },
    content: { },
    footer: { }
  };
};
// Extend the DrupalGap Theme prototype.
Ava.prototype = new dg.Theme;
Ava.prototype.constructor = Ava;
