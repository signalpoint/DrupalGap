dg.themes.Bean = function() {
  this.regions = {
    header: {
      _format: 'nav',
      _attributes: {
        'class': ['navbar navbar-default']
      },
      _prefix: '<div class="container">',
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
dg.themes.Bean.prototype = new dg.Theme;
dg.themes.Bean.prototype.constructor = dg.themes.Bean;
