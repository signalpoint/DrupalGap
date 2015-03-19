/**
 * Implements DrupalGap's template_info() hook.
 */
function ava_info() {
  try {
    var theme = {
      name: 'ava',
      regions: {}
    };
    theme.regions['header'] = {
      attributes: {
        'data-role': 'header',
        'data-theme': 'b',
        'data-position': 'fixed'
      }
    };
    theme.regions['content'] = {
      attributes: {
        'class': 'ui-content',
        'role': 'main'
      }
    };
    theme.regions['footer'] = {
      attributes: {
        'data-role': 'footer',
        'data-theme': 'b',
        'data-position': 'fixed'
      }
    };
    return theme;
  }
  catch (error) { drupalgap_error(error); }
}

