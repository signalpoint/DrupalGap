For other example usage, see: [Checkboxes Form Elements](../Forms/Form_Elements/Checkboxes)

![Checkbox Widget](http://drupalgap.org/sites/default/files/checkbox.png)

## Render Element

```
var content = {};
content.my_checkbox = {
  _theme: 'checkbox',
  _attributes: {
    id: 'my_checkbox',
    checked: 'checked'
  }
};
return content;
```

## dg.theme('checkbox', ...)

```
// Build the checkbox.
var checkbox = {
  title: 'Enjoy pizza?',
  attributes: {
    id: 'my_checkbox',
    checked: 'checked'
  }
};

// Build the label.
var label = { element: checkbox };
label.element.id = checkbox.attributes.id;
 
// Render the checkbox and label and return it.
return dg.theme('checkbox', checkbox) +
       dg.theme('form_element_label', label);
```