/**
 * Implements DrupalGap's template_info() hook.
 */
function easystreet3_info() {
  try {
    if (drupalgap.settings.debug) {
      console.log('easystreet3_info()');
      console.log(JSON.stringify(arguments));
    }
    // TODO - This should be converted so the regions can be accessed with
    // easystreet3.regions.header and the easystreet3.regions.header.name would
    // be equal to 'header'. The name property should be set by DrupalGap upon
    // invocation of this hook so implementers don't have to set it.
    // TODO - Regions (other system regions, e.g. 'content') should have
    // visibility rules similar to the drupalgap.settings.blocks, that way
    // entire regions can be displayed/hidden based on the current path, neat-o.
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
    alert('easystreet3_theme_info - ' + error);
  }
}

