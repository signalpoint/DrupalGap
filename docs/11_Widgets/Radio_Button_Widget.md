View the [Radio Button Form Element](../Forms/Form_Elements/Radio_Buttons) page to place radio buttons within a form.

![Radio Button Widget](http://drupalgap.org/sites/default/files/radio-button-widget.png)

## Render Element

```
var content = {};
content['my_radio_buttons'] = {
  theme: 'radios',
  options: {
    0: 'Rock and Roll',
    1: 'Metal'
  },
  value: 1
};
return content;
```

## dg.theme('radios', ...)

```
var html = dg.theme('radios', {
  options: {
    0: 'Rock and Roll',
    1: 'Metal'
  },
  value:1
});
return html;
```

## Handling Clicks on Radio Buttons

### The Radio Buttons

```
function my_module_welcome() {
  var content = {};
  content['my_radio_buttons'] = {
    theme: 'radios',
    options: {
      0: 'Rock and Roll',
      1: 'Metal'
    },
    value: 1,
    attributes: {
      onclick: "my_radio_handler(this)"
    }
  };
  return content;
}
```

### The Click Handler

```
function my_radio_handler(radio) {
  drupalgap_alert('Clicked on radio: ' + $(radio).val());
}
```