Welcome to the DrupalGap "Hello World". By completing this guide, you'll be ready to build a mobile application for your Drupal website. Along the way, be sure to visit the [support](http://drupalgap.org/support) and [troubleshoot](Install/Troubleshoot) pages if you run into any problems.

## 1. Install DrupalGap

Follow the [DrupalGap Install](Install) documentation.

## 2. Create a Custom DrupalGap Module

Follow the [Create a Custom DrupalGap Module](Modules/Create_a_Custom_Module) documentation.

## 3. Create the "Hello World" App Page

Place this code into the custom module's JavaScript file:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['hello_world'] = {
    title: 'DrupalGap',
    page_callback: 'my_module_hello_world_page'
  };
  return items;
}

/**
 * The callback for the "Hello World" page.
 */
function my_module_hello_world_page() {
  var content = {};
  content['my_button'] = {
    theme: 'button',
    text: 'Hello World',
    attributes: {
      onclick: "drupalgap_alert('Hi!')"
    }
  };
  return content;
}
```

## 4. Set the App's Front Page

Open the `app/settings.js` file and set the app's front page path:

```
drupalgap.settings.front = 'hello_world';
```

## 5. Run the App!

Now when we run the app, we'll have a "Hello World" button widget that will say "Hi" when clicked:

![Hello World](http://www.drupalgap.org/sites/default/files/hello-world_0.png)

That's it, you've now got the basic tools to build a custom mobile application for a Drupal website!

Next, try placing an additional [widget](Widgets) or two on your page or head back to the getting started guide for more topics and features within DrupalGap.
