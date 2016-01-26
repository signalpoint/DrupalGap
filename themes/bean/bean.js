Bean = function() {
  this.regions = {
    header: {
      _format: 'nav',
      _attributes: {
        'class': ['navbar navbar-inverse']
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
Bean.prototype = new dg.Theme;
Bean.prototype.constructor = Bean;
