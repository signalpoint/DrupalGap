dg.themes.Burrito = function() {
  this.regions = {
    header: {
      _format: 'nav',
      _attributes: {
        'class': ['navbar navbar-default navbar-inverse']
      },
      _prefix: '<div class="container-fluid">',
      _suffix: '</div>'
    },
    content: {
      _attributes: {
        'class': ['container']
      }
    },
    footer: {
      _format: 'footer',
      _attributes: {
        'class': ['footer']
      },
      _prefix: '<div class="container">',
      _suffix: '</div>'
    }
  };
};
// Extend the DrupalGap Theme prototype.
dg.themes.Burrito.prototype = new dg.Theme;
dg.themes.Burrito.prototype.constructor = dg.themes.Burrito;
