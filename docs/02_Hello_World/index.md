> Welcome to the DrupalGap "Hello World"

By completing this guide, you'll be ready to build a custom application for Drupal 8.

### 1. Install DrupalGap

First, complete the [DrupalGap installation](../Install) docs.

```
http://example.com/app
```

### 2. Create a module

Next, [create a custom DrupalGap module](../Modules/Create_a_Custom_Module) to power the app.

```
app/modules/custom/my_module
```

## 3. Create a page

Next, we'll [create a custom page](../Pages/Creating_a_Custom_Page) and add this to the route's `_callback` function:

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

## 4. Set the App's Front Page

Open the `settings.js` file and set the app's front page path:

```
drupalgap.settings.front = 'hello_world';
```

## 5. Run the App!

Now when we run the app, we'll have a "Hello World" button widget that will say "Hi" when clicked:

![Hello World](http://www.drupalgap.org/sites/default/files/hello-world_0.png)

That's it, you've now got the basic tools to build a custom mobile application for a Drupal website!

Next, try placing an additional [widget](Widgets) or two on your page or head back to the getting started guide for more topics and features within DrupalGap.
