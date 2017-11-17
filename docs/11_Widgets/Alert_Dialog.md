Instead of using JavaScript's default `alert()` function, it is recommended to use `dg.alert()`. When in compiled app mode, this function utilizes Cordova's `notification.alert()`, so the Dialogs plugin for Cordova.

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