## The 'messages' block

DrupalGap comes with a system block to handle the display of these messages. In order for messages to be visible within the mobile app, we must specify the `messages` block to be visible inside a region within our theme, via the `settings.js` file:

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

## dg.setMessage()

With this function, it is possible to display informative messages to users. To display messages like this, try out these code snippets:

```
dg.setMessage(dg.t('Hello World'));
dg.setMessage(dg.t('Is everything OK?'), 'warning');
dg.setMessage(dg.t('Oh no!'), 'error');
```

Be default, the `status` message type will be used. Alternatively, you can choose to display a warning message or an error message by passing in an optional message type to the function.

It is important to understand that when you call this function, the message will not be displayed until the next page is loaded.

## Refreshing the Messages Block

To refresh the `messages` block without navigating away from the current page, try this:

```
dg.showMessage(dg.t('Hello world'));
```

This will automatically refresh/show the message in the `messages` block.

We also can then still queue up messages, and then show them to the user without navigating away from the current page. *For example*:

```
// Create message #1 when something happens...
var account = dg.currentUser();
var msg1 = dg.t('Hello @name', {
  '@name': account.getAccountName()
});
dg.setMessage(msg1);
```

The user stays on the page for a while, then they trigger some other event, we queue up another message, then show them all the messages:

```
var msg2 = dg.t('How are you?');
dg.setMessage(msg2);
dg.showMessages();
```
