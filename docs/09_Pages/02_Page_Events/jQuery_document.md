By default DrupalGap dynamically injects your module(s) JavaScript files into the `<head>` of your application. This works well for many things, however one thing it doesn't work well for is re-acting on jQuery's `$(document)` events.

To get around this we can include a separate JS file in the `<head>` of the `index.html` file:

```
<head>
...
<!-- My Module JS Extras-->
<script type="text/javascript" src="app/modules/custom/my_module/my_module.inline.js"></script>
...
</head>
```

Then in our `my_module.inline.js` file we can easily react to any typical jQuery event, for example:

```
$(document).on("keypress", "#my-text-field", function(e) {

    if (e.which == 13) {
      alert('You pressed enter, good job dude!');
    }

});
```