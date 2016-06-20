## drupalgap_toast()

With a "toast" we can show a non intrusive message to the user:

`drupalgap_toast('<p>Hello World!</p>');`

We can optionally specify how many milliseconds to wait before closing the message (1500):

`drupalgap_toast('...', 1500);`

And optionally specify how many milliseconds to wait before opening the message (750):

`drupalgap_toast('...', 1500, 750);`

It is important that the opening time not be instantaneous, or the toast message may not show properly. DrupalGap uses sensible default values for the open and close times if none are provided.

## drupalgap_alert()

Instead of using JavaScript's default alert() function, it is recommended to use drupalgap_alert() instead. This function utilizes PhoneGap's notifcation.alert feature, so if you're using PhoneGap install that plugin.

Here's the simplest use:

`drupalgap_alert('Hello World');`

This function is asynchronous, so any code after it will continue to run. However, you can pass in a callback function to run code after the notification is closed, like so:

```
drupalgap_alert('Hello World', {
    alertCallback: function() { /* do something when the alert is closed... */ }
});
```

This feature also allows you to customize the title of the message box, and customize the text that appears on the button:

```
drupalgap_alert('Hello World', {
    title: 'My Alert Title',
    buttonName: 'Done'
});
```

Note, the alertCallback, title and buttonName options do not work appear to work when debugging in Ripple.

## drupalgap_set_message()

With this function, it is possible to display informative messages to users. Here's a screenshot of a status message, a warning message, and an error message:

![DrupalGap Messages Screenshot](http://drupalgap.org/sites/default/files/drupalgap-set-message.png)

To display messages like this, try out these code snippets:

```
drupalgap_set_message('Hello World');
drupalgap_set_message('Is everything OK?', 'warning');
drupalgap_set_message('Oh no!', 'error');
```

Be default, the status message type will be used. Alternatively, you can choose to display a warning message or an error message by passing in an optional message type to the function.

It is important to understand that when you call this function, the message will not be displayed until the next page is loaded.

### The 'messages' block

DrupalGap comes with a system block to handle the display of these messages. In order for messages to be visible within the mobile app, we must specify the 'messages' block to be visible inside a region within our theme, via the settings.js file:

```
drupalgap.settings.blocks.my_theme = {

  /* ... */

  content: {
    messages: {},
    main: {}
  }

  /* ... */

};
```

Checkout the [default.settings.js](https://github.com/signalpoint/DrupalGap/blob/7.x-1.x/app/default.settings.js) file for example usage.
