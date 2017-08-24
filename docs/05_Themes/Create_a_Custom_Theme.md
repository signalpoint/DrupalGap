> Q: How to fix @deprecated notice? (*2016-10-13*)

A: See the `hook_TYPE_tpl_html()` example implementations below.

### 1. Create a directory

Create a directory to store the files and images associated with your theme:

`app/themes/my_theme`

### 2. Create a theme .js file

Create a `.js` file to build the custom theme:

`app/themes/my_theme/my_theme.js`

### 3. Build the .js file

Now we can set up our theme, regions and template string functions in the `my_theme.js` file:

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
      'data-theme': 'b'
    }
  };

  // Return the assembled theme.
  return theme;

}

/**
 * Implements hook_TYPE_tpl_html().
 */
function my_theme_page_tpl_html() {
  return '<div {:drupalgap_page_attributes:}>' +
            '{:header:}' +
            '{:content:}' +
            '{:footer:}' +
          '</div>';
}

/**
 * Implements hook_TYPE_tpl_html().
 */
function my_theme_node_tpl_html() {
  return '<h2>{:title:}</h2>' +
          '<div>{:content:}</div>' +
          '<div>{:comments:}</div>' +
          '<div>{:comments_form:}</div>';
}

/**
 * Implements hook_TYPE_tpl_html().
 */
function my_theme_user_profile_tpl_html() {
  return '<h2>{:name:}</h2>' +
          '<div>{:created:}</div>' +
          '<div class="user-picture">{:picture:}</div>' +
          '<div>{:content:}</div>';
}

```

In previous versions of DrupalGap, the strings returned by the `hook_TYPE_tpl_html()` implementations above used to live in files like `page.tpl.html`, `node.tpl.html` and `user-profile.tpl.html`. However, loading one or more of these files from disc each time we navigate to a page can have a noticeable performance degradation on mobile devices. Now we just return those template files as a string with functions in our theme's `.js` file.

#### Minimum Required Regions

Please note, DrupalGap expects each theme to implement at a minimum the following three regions (more info: http://api.drupalgap.org/global.html#system_regions_list):

 - `header`
 - `content`
 - `footer`

### 4. Add Blocks to the Regions

Add blocks to your theme's regions in the `settings.js` file:

```
// The my_theme blocks.
drupalgap.settings.blocks.my_theme = {
  header: {
    title: {},
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

The `title`, `main_menu`, `main`, and `powered_by` blocks are all system blocks provided by DrupalGap. You may create your own custom blocks if needed.

## 5. Set active theme

Make DrupalGap aware of your theme by specifying it in the `settings.js` file:

```
// Theme
drupalgap.settings.theme = 'my_theme';
```
