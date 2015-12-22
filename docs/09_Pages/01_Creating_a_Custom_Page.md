

Just like Drupal, DrupalGap uses `hook_menu()` to manage the creation and display of our mobile app's pages. This means, we can quickly and easily create pages within our mobile application.

To create a custom page in our DrupalGap mobile application, follow these steps:

## 1. Create a Custom DrupalGap Module

[Learn how to create a DrupalGap Module](../Modules/Create_a_Custom_Module)

## 2. Add a route

```
my_module.routing = function() {
  var routes = {};

  // My example page route.
  routes["my_module.example"] = {
    "path": "/hello-world",
    "defaults": {
      "_controller": function() {
        return new Promise(function(ok, err) {
          var text = 'Hello World';
          var account = dg.currentUser();
          if (account.isAuthenticated()) {
            text = 'Hello ' + account.getAccountName();
          }
          ok(text);
        });
      },
      "_title": "Hello World"
    },
    "requirements": {
      "_permission": "access content"
    }
  };
  
  // Add another route here, if you want...

  // Returns the routes.
  return routes;
};
```

## 3. View the Custom Page

To view the newly created custom page, we could set our App's front page to the path of the custom page. For example, in the `app/settings.js` file, set the `front` variable to the `hello-world` page path:

```
// App Front Page
drupalgap.settings.front = 'hello-world';
```

Now when we load the App, we should see our custom page:

*Screenshot needed*