dg.themes.Frank = function() {
  this.regions = {
    header: {
      _format: 'header',
      _prefix: '<div class="top-bar">',
      _suffix: '</div>'
    },
    content: {
      _attributes: {
        'class': 'row columns'
      }
    },
    footer: {
      _format: 'footer',
      _prefix: '<div class="row">',
      _suffix: '</div>'
    }
  };
};
// Extend the DrupalGap Theme prototype.
dg.themes.Frank.prototype = new dg.Theme;
dg.themes.Frank.prototype.constructor = dg.themes.Frank;
