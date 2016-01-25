Bean = function() {
  this.regions = {
    header: { },
    content: { },
    footer: { }
  };
};
// Extend the DrupalGap Theme prototype.
Bean.prototype = new dg.Theme;
Bean.prototype.constructor = Bean;
