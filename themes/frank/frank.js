Frank = function() {
  this.regions = {
    header: {
      attributes: {
        'class': 'row'
      }
    },
    content: {
      attributes: {
        'class': 'row'
      }
    },
    footer: {
      attributes: {
        'class': 'row'
      }
    }
  };
};
// Extend the DrupalGap Theme prototype.
Frank.prototype = new dg.Theme;
Frank.prototype.constructor = Frank;
