/**
 * Implements DrupalGap's template_info() hook.
 */
function easystreet3_info() {
  try {
    return {
      name: 'easystreet3',
      regions: {
        header: {
          attributes: {
            'data-role': 'header',
            'data-theme': 'b',
            'data-position': 'fixed'
          }
        },
        sub_header: {
          attributes: {
            'data-role': 'header'
          }
        },
        navigation: {
          attributes: {
            'data-role': 'navbar'
          }
        },
        content: {
          attributes: {
            'class': 'ui-content',
            'role': 'main'
          }
        },
        footer: {
          attributes: {
            'data-role': 'footer',
            'data-theme': 'b',
            'data-position': 'fixed'
          }
        }
      }
    };
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implements hook_TYPE_tpl_html().
 */
function easystreet3_page_tpl_html() {
  return '<div {:drupalgap_page_attributes:}>' +
      '{:header:}' +
      '{:sub_header:}' +
      '{:navigation:}' +
      '{:content:}' +
      '{:footer:}' +
      '</div>';
}

/**
 * Implements hook_TYPE_tpl_html().
 */
function easystreet3_node_tpl_html() {
  return '<h2>{:title:}</h2>' +
      '<div>{:content:}</div>' +
      '<div>{:comments:}</div>' +
      '<div>{:comments_form:}</div>';
}

/**
 * Implements hook_TYPE_tpl_html().
 */
function easystreet3_user_profile_tpl_html() {
  return '<h2>{:name:}</h2>' +
      '<div>{:created:}</div>' +
      '<div class="user-picture">{:picture:}</div>' +
      '<div>{:content:}</div>';
}
