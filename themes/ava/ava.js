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

/**
 * Implements hook_TYPE_tpl_html().
 */
function ava_page_tpl_html() {
  return '<div {:drupalgap_page_attributes:}>' +
      '{:header:}' +
      '{:content:}' +
      '{:footer:}' +
      '</div>';
}

/**
 * Implements hook_TYPE_tpl_html().
 */
function ava_node_tpl_html() {
  return '<h2>{:title:}</h2>' +
      '<div>{:content:}</div>' +
      '<div>{:comments:}</div>' +
      '<div>{:comments_form:}</div>';
}

/**
 * Implements hook_TYPE_tpl_html().
 */
function ava_user_profile_tpl_html() {
  return '<h2>{:name:}</h2>' +
      '<div>{:created:}</div>' +
      '<div class="user-picture">{:picture:}</div>' +
      '<div>{:content:}</div>';
}
