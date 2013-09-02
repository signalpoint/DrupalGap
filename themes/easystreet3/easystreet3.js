/**
 * Implements DrupalGap's template_info() hook.
 */
function easystreet3_info() {
  try {
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
  catch (error) { drupalgap_error(error); }
}

