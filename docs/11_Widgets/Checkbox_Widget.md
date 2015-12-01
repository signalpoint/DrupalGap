For other example usage, see: [Checkboxes Form Elements](../Forms/Form_Elements/Checkboxes)

![Checkbox Widget](http://drupalgap.org/sites/default/files/checkbox.png)

## Render Array

```
var content = {};
content['my_checkbox'] = {
  theme: 'checkbox',
  attributes: {
    id: 'my_checkbox',
    checked: 'checked'
  }
};
content['my_checkbox_label'] = {
  theme: 'form_element_label',
  element: {
    title: 'Enjoy Pizza?',
    attributes: {
      'for': 'my_checkbox'
    }
  }
};
return content;
```

## theme('checkbox', ...)

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
return theme('checkbox', checkbox) +
       theme('form_element_label', label);
```