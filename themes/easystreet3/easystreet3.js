/**
 * Implements DrupalGap's template_info() hook.
 */
function easystreet3_info() {
  try {
    if (drupalgap.settings.debug) {
      console.log('easystreet3_info()');
      console.log(JSON.stringify(arguments));
    }

    // TODO - Regions (other system regions, e.g. 'content') should have
    // visibility rules similar to the drupalgap.settings.blocks, that way
    // entire regions can be displayed/hidden based on the current path, neat-o.
    var theme = {
      "name":"easystreet3",
      "regions":{
        "header":{
          "attributes":{
            "data-role":"header"
          }
        },
        "navigation":{
          "attributes":{
            "data-role":"navbar"
          }
        },
        "sub_navigation":{
          "attributes":{
            "data-role":"navbar"
          }
        },
        "content":{
          "attributes":{
            "data-role":"content"
          }
        },
        "footer":{
          "attributes":{
            "data-role":"footer"
          }
        }
      }
    };
    return theme;
  }
  catch (error) {
    alert('easystreet3_theme_info - ' + error);
  }
}

