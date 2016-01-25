By completing this guide, you'll be ready to build a custom application for Drupal 8.

### 1. Install DrupalGap

First, complete the [DrupalGap installation](../Install) docs.

```
http://example.com/app
```

### 2. Create a module

Next, [create a custom DrupalGap module](../Modules/Create_a_Custom_Module) to power the app:

```
cd app
./dg create module my_module
```

And then include it in the `<head>` of the app's `index.html` file:

```
<script src="modules/custom/my_module/my_module.js"></script>
```

### 3. Create a route

Next, we'll [create a route for the page](../Pages/Creating_a_Custom_Page) in the `my_module.js` file:

```
my_module.routing = function() {
  var routes = {};

  // My example page route.
  routes["my_module.example"] = {
    "path": "/hello-world",
    "defaults": {
      "_title": "Hello World",
      "_controller": function() {

        // Page content goes here...

      }
    }
  };

  return routes;
};
```

### 4. Render the page

Next, add this code to the route's `_callback` function in the `my_module.js` file to render the page:

```
return new Promise(function(ok, err) {

  // Make a greeting for the current user.
  var account = dg.currentUser();
  var msg = account.isAuthenticated() ?
    'Hello ' + account.getAccountName() :
    'Hello World';

  // Prepare our page's render element.
  var element = {};
  element['my_widget'] = {
    _markup: '<p>' + msg + '</p>'
  };

  // Send it back to be rendered on the page.
  ok(element);

});
```

### 5. Run the App!

When we navigate to the page, it will say hello to us:

```
http://example.com/app/#hello-world
```

> What's next?

You've now got the basic tools to build a custom app for Drupal 8! Next, try spicing up the display of your app with a [theme](../Themes).
