
/**
 * Implements DrupalGap's template_info() hook.
 */
function spi_info() {
  try {
    var theme = {
      name: 'spi',
      regions: {}
    };
    theme.regions['header'] = {
      format: 'nav', // wrap in a nav element instead of a div
      attributes: {
        'class': 'navbar navbar-inverse navbar-fixed-top'
      }
    };
    theme.regions['content'] = {
      attributes: {
        'class': 'container'
      }
    };
    theme.regions['footer'] = {
      format: 'footer', // wrap in a footer element instead of a div
      attributes: {
        'class': 'footer'
      }
    };
    return theme;
  }
  catch (error) { drupalgap_error(error); }
}

