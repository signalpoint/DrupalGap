

Just like Drupal, DrupalGap uses `hook_menu()` to manage the creation and display of our mobile app's pages. This means, we can quickly and easily create pages within our mobile application.

To create a custom page in our DrupalGap mobile application, follow these steps:

## 1. Create a Custom DrupalGap Module

[Learn how to create a DrupalGap Module](../Modules/Create_a_Custom_Module)

## 2. Add a route

```
/**
 * Defines custom routes for my_module.
 */
my_module.routing = function() {
  var routes = {};

  // My example page route.
  routes["my_module.example"] = {
    "path": "/hello-world",
    "defaults": {
      "_title": "Hello World",
      "_controller": function() {
        return new Promise(function(ok, err) {
        
          // Make a greeting for the current user.
          var account = dg.currentUser();
          var msg = account.isAuthenticated() ?
            'Hello ' + account.getAccountName() :
            'Hello World';

          // Prepare our page's render element(s).
          var element = {};
          element['my_widget'] = {
            _markup: '<p>' + msg + '</p>'
          };

          // Send the element back to be rendered on the page.
          ok(element);

        });
      }
    }
  };
  
  // Add another route here, if you want...

  // Returns the routes.
  return routes;
};
```

## 3. View the Custom Page

To view the newly created custom page, we could set our App's front page to the path of the custom page. For example, in the `settings.js` file, set the `front` variable to the `hello-world` page path:

```
// App Front Page
dg.settings.front = 'hello-world';
```

Now when we load the App, we should see our custom page:

*Screenshot needed*
