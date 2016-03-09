For a complete example of a custom theme, check out the drupalgap_demo app. Otherwise, to create a custom theme in DrupalGap, follow these steps:

## 1. Create a directory for your theme:

`app/themes/my_theme`

## 2. Create an html file for your theme's page template:

`app/themes/my_theme/page.tpl.html`

## 3. Design your page template using html, region placeholders and the drupalgap page id placeholder:

Latest dev snapshot use this (as of 2014-09-25):

```
<div {:drupalgap_page_attributes:}>
  {:header:}
  {:navigation:}
  {:content:}
  {:footer:}
</div>
```

Versions of the DrupalGap SDK prior to April 2014 should use this instead:

```
<div id="{:drupalgap_page_id:}" class="{:drupalgap_page_class:}" data-role="page">
  {:header:}
  {:navigation:}
  {:content:}
  {:footer:}
</div>
```

Please note, DrupalGap expects each theme to implement at a minimum the following three regions (more info: http://api.drupalgap.org/global.html#system_regions_list):

 - header
 - content
 - footer

## 4. Create a javascript file for your theme. The name of the file must match the name of your theme's directory:

`app/themes/my_theme/my_theme.js`

## 5. Set up your theme and its regions in the javascript file:

```
/**
 * Implements DrupalGap's template_info() hook.
 */
function my_theme_info() {

  // Init an empty theme object.
  var theme = {};

  // Set the theme's machine name.
  theme.name = 'my_theme';

  // Init the theme's regions.
  theme.regions = {};

  // Header region.
  theme.regions['header'] = {
    attributes: {
      'data-role': 'header',
      'data-position': 'fixed',
      'data-theme': 'b'
    }
  };

  // Navigation region.
  theme.regions['navigation'] = {
    attributes: {
      'data-role': 'navbar'
    }
  };

  // Content Region
  theme.regions['content'] = {
    attributes: {
      'data-role': 'content'
    }
  };

  // Footer region.
  theme.regions['footer'] = {
    attributes: {
      'data-role': 'footer',
      'data-position': 'fixed',
      'data-position': 'b'
    }
  };

  // Return the assembled theme.
  return theme;

}
```

## 6. Add blocks to your theme's regions in settings.js:

```
// The my_theme blocks.
drupalgap.settings.blocks.my_theme = {
  header: {
    title: {}
  },
  navigation: {
    main_menu: {}
  },
  content: {
    main: {}
  },
  footer: {
    powered_by: {}
  }
};
```

The title, main_menu, main, and powered_by blocks are all system blocks provided by DrupalGap. You may create your own custom blocks if needed.

## 7. Copy the other tpl.html files from the core theme into your theme's directory, so they live here:

    www/app/themes/my_theme/node.tpl.html
    www/app/themes/my_theme/user-profile.tpl.html

## 8. Make drupalgap aware of your theme by specifying it in settings.js

```
// Theme
drupalgap.settings.theme = 'my_theme';
```