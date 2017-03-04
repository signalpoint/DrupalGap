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


## Unique Checkbox Ids
In some cases you may want to use the same checkbox on multiple pages within your app. An example use case is a settings page or panel for each node in your app that allows users to turn notifications on/off for that specific node (e.g., a group). In this case you need to add a checkbox with unique IDs in order for functionality and rendering to work correctly each time the checkbox is loaded for each node. In the example code below, __nid__ is passed as a variable to the page callback.

```
var content = {};
content['my_checkbox'] = {
  theme: 'checkbox',
  attributes: {
    id: 'my_checkbox' + nid + Drupal.user.uid,
    checked: 'checked'
  }
};
content['my_checkbox_label'] = {
  theme: 'form_element_label',
  element: {
    title: 'Enjoy Pizza?',
    attributes: {
      'for': 'my_checkbox' + nid + Drupal.user.uid
    }
  }
};
return content;
