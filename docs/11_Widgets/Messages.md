## dg.alert()

Instead of using JavaScript's default alert() function, it is recommended to use dg.alert() instead. This function utilizes PhoneGap's `notifcation.alert` feature, so if you're using PhoneGap install that plugin.

Here's the simplest use:

`dg.alert(dg.t('Hello World'));`

This function is asynchronous, so any code after it will continue to run. However, you can pass in a callback function to run code after the notification is closed, like so:

```
dg.alert(dg.t('Hello World'), {
    alertCallback: function() { /* do something when the alert is closed... */ }
});
```

This feature also allows you to customize the title of the message box, and customize the text that appears on the button:

```
dg.alert(dg.t('Hello World'), {
    title: dg.t('My Alert Title'),
    buttonName: dg.t('Done')
});
```

Note, the alertCallback, title and buttonName options do not appear to work when debugging in Ripple.

## dg.confirm()

```
dg.confirm(dg.t('Are you sure?'), {
  confirmCallback: function(button) {
    if (button == 1) { // Ok.

    }
    else if (button == 2) { // Cancel.

    }
  }
});
```

## dg.setMessage()

With this function, it is possible to display informative messages to users. To display messages like this, try out these code snippets:

```
dg.setMessage(dg.t('Hello World'));
dg.setMessage(dg.t('Is everything OK?'), 'warning');
dg.setMessage(dg.t('Oh no!'), 'error');
```

Be default, the status message type will be used. Alternatively, you can choose to display a warning message or an error message by passing in an optional message type to the function.

It is important to understand that when you call this function, the message will not be displayed until the next page is loaded.

### The 'messages' block

DrupalGap comes with a system block to handle the display of these messages. In order for messages to be visible within the mobile app, we must specify the 'messages' block to be visible inside a region within our theme, via the settings.js file:

```
dg.settings.blocks[dg.config('theme').name] = {

  /* ... */

  content: {

    // DrupalGap's messages block.
    messages: { },

    // DrupalGap's main content block.
    main: { }

  }

  /* ... */

};
```
