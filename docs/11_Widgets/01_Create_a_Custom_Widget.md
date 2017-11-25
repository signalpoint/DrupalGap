As an example, let's make a widget called `my_module_clock` that displays the current time.

## Using the Widget

This widget will be re-usable throughout the application like so within a render element...

```
var element = {};
element.time = {
  _theme: 'my_module_clock'
};
return element;
```

... or can be rendered directly as html:

```
var html = dg.theme('my_module_clock');
```

## Implementing the Widget

In a custom DrupalGap 8 Module, try this:

```
dg.theme_my_module_clock = function(variables) {

  // Give our clock a random id if one wasn't provided.
  if (!variables._attributes.id) {
    variables._attributes.id = 'clock-' + dg.userPassword();
  }
  
  // Add our class name.
  variables._attributes.class.push('my-module-clock');

  // Get the current date.
  var d = new Date();

  // Add a post render handler to update the clock every second.
  variables._postRender.push(function() {

    setInterval(function() {
      d = new Date();
      var divId = variables._attributes.id;
      var div = document.getElementById(divId);
      if (div) {
        div.innerHTML = d.toTimeString();
      }

    }, 1000)

  });

  // Return a div with the current time.
  return '<div ' + dg.attrs(variables) + '>' + d.toTimeString() + '</div>';
};
```
