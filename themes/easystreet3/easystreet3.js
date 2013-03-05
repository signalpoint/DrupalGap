/**
 * Implements DrupalGap's template_info() hook.
 */
function easystreet3_info() {
  try {
    if (drupalgap.settings.debug) {
      console.log('easystreet3_info()');
      console.log(JSON.stringify(arguments));
    }
    return {
      'name':'easystreet3',
      'regions':[
        {
          'name':'header',
          'attributes':{
            'data-role':'header'
          }
        },
        {
          'name':'navigation',
          'attributes':{
            'data-role':'navbar'
          }
        },
        {
          'name':'content',
          'attributes':{
            'data-role':'content'
          }
        },
        {
          'name':'footer',
          'attributes':{
            'data-role':'footer'
          }
        },
      ],
    };
  }
  catch (error) {
    alert('easystreet3_theme_info - ' + error);
  }
}

