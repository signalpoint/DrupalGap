By completing this guide, you'll be ready to build a custom application for Drupal 8.

### 1. Install DrupalGap

First, complete the [DrupalGap installation](Install) docs.

```
http://example.com/app
```

### 2. Create a module

Next, [create a custom DrupalGap module](Modules/Create_a_Custom_Module) to power the app:

```
cd app
./dg create module example
```

### 3. Create a route

Next, we'll [create a route for the page](Pages/Creating_a_Custom_Page) in the `example.js` file:

```
example.routing = function() {
  var routes = {};

  // My example page route.
  routes["example.hello"] = {
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

You'll notice the `create module` command has already provided the `routing` function for you. You can use it as a starting grounds.

### 4. Render the page

Next, add this code inside the route's `_controller` function in the `example.js` file to render the page:

```
// Prepare our page's render element.
var element = {};

// Make a greeting for the current user.
var account = dg.currentUser();
var msg = account.isAuthenticated() ?
  dg.t('Hello @name', {
    '@name': account.getAccountName()
  }) : dg.t('Hello World');

// Add the greeting as a message to our element.
element['my_widget'] = {
  _theme: 'message',
  _message: msg
};

// Send it back to be rendered on the page.
return element;
```

### 5. Run the App!

When we navigate to the page, it will say hello to us:

```
http://example.com/app/#hello-world
```

> What's next?

You've now got the basic tools to build a custom app for Drupal 8! Next, try spicing up the display of your app with a [theme](Themes).
