## Page Caching

When a user visits a page in a DrupalGap mobile application, the output of the page is cached (i.e. it will stay in the DOM), that way subsequent visits to the page respond quickly (because the page is already in the DOM). Related info: [Reloading Pages](../Pages/Reloading_Pages)

## Entity Caching

In the [settings.js](https://github.com/signalpoint/DrupalGap/blob/7.x-1.x/app/default.settings.js) file, we can control how entities are cached.

```
// Entity Caching
Drupal.settings.cache.entity = {

  /* Globals (will be used if not overwritten below) */
  enabled: true,
  expiration: 60, // # of seconds to cache

  /* Entity types */
  entity_types: {

    // Nodes
    node: {

      // Node Globals (will be used if not overwritten below)
      enabled: true,
      expiration: 120,

      // Content types (aka bundles)
      bundles: {

        article: {
          expiration: 3600
        },
        page: {
          enabled: false
        }

      }
      
    }

  }

};
```

View the **Entity Caching** section in the [default.settings.js](https://github.com/signalpoint/DrupalGap/blob/7.x-1.x/app/default.settings.js) file for advanced usage. 

Using these example settings, whenever we retrieve a node from the Drupal server, a copy of it will be saved into local storage.

Since the expiration is set to 3600 seconds (one hour), anytime the app tries to load the entity in the next hour, it will get a cached copy of it rather than asking the Drupal server to retrieve it. Anytime the app tries to load that same entity one hour after the initial retrieval, a new copy will be retrieved from the Drupal server since the local copy has expired.

To disable entity caching, set the `enabled` property to `false`.

Please keep in mind, that if the page is set to be reloaded, then by default a fresh copy of the entity will be retrieved from the Drupal server, for example:

`l('My Link', 'my_custom_page', {reloadPage:true});`

Unless the 'reset' option is explicitly set to false, then the page will be reloaded but the entity will still be loaded from local storage (if it hasn't expired):

`l('My Link', 'my_custom_page', {reloadPage:true, reset:false});`
