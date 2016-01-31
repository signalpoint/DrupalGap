dg.themes.Ava = function() {
  this.regions = {
    header: { },
    content: { },
    footer: { }
  };
};
// Extend the DrupalGap Theme prototype.
dg.themes.Ava.prototype = new dg.Theme;
dg.themes.Ava.prototype.constructor = dg.themes.Ava;
