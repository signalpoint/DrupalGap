A Back Button can be placed into a region as a link. The button allows users a quick way to get back to the previous page of our app. Back buttons can be added as a using the `app/settings.js` file. Typically we don't want the Back Button to show up on the home page, so we can exclude it from the front page using visibility rules.

![Back Button](http://drupalgap.org/sites/default/files/back-button.png)

For more information, check out [Adding Menu Links to Regions](../../Menus/Region_Menu_Links).

## app/settings.js

```
drupalgap.settings.menus.regions['header'] = {
  links:[
    {
      title:'Back',
      options:{
        attributes:{
          'data-icon':'back',
          'class':'ui-btn-right',
          'onclick':'javascript:drupalgap_back();'
        }
      },
      pages:{
        value:[''],
        mode:'exclude'
      }
    }
  ]
};
```

Developers, also look at [hook_drupalgap_back()](http://api.drupalgap.org/7/global.html#hook_drupalgap_back).
