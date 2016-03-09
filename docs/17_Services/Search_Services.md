DrupalGap has built in support for utilizing your Drupal site's search feature. This allows you to search your Drupal site's content and user from your mobile application.

![Search Bar Widget](http://drupalgap.org/sites/default/files/search.png)

## Drupal Module

You'll need the latest **development snapshot** of the [Services Search](https://drupal.org/project/services_search) module, or wait until the 7.x-3.1 version of the module is released to utilize these features.

Download and enable this module on your Drupal site.

## User Permissions

Make sure your users have permission to search your site. On your Drupal site, go to:

`admin/people/permissions`

And verify the following permission is enabled for your desired user role(s):

- Use Search

## Services Resources

You'll need to enable one or both of the resources from the search service. Go to:

`admin/structure/services/list/drupalgap/resources`

Then check the `retrieve` box under the following resources:

- search_node
- search_user

## Search Block

You may use the built in Search Block to allow your users to search for content. Just add the search block to a region on your theme in the `settings.js` file. For example, to make the search block visible on the dashboard page in the content region, try something like this:

```
drupalgap.settings.blocks.my_custom_theme = {

  /* ... other regions ... */
  content: {

    /* ... other blocks ... */

    search: {
      pages: {
        value: ['dashboard'],
        mode: 'include'
      }
    }

  }

};
```

## Search Results Page

DrupalGap has a built in search results page. By default, the search block will send the user to this page when they perform a search.

![Search Results Page](http://drupalgap.org/sites/default/files/search-results.png)

To manually perform a search, just send the user to the search results page, with the search parameters in the page path. Here are some examples:

### Search for Content

To search for nodes that contain **hello**, navigate to this page:

drupalgap_goto('search/node/hello');

### Search for Users

To search for users with **john**, navigate to this page:

`drupalgap_goto('search/user/john');`