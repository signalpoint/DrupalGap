/**
 * Implements DrupalGap's template_info() hook.
 */
function example_info() {
  try {
    if (drupalgap.settings.debug) {
      console.log('example_info()');
      console.log(JSON.stringify(arguments));
    }
    return {
      'name':'example',
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
          'name':'sub_navigation',
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
    alert('example_info - ' + error);
  }
}

