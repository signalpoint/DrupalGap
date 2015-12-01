We can use the HTML [placeholder](http://www.w3schools.com/tags/att_input_placeholder.asp) attribute on our form elements if need be. By default, our form element titles (labels) will be rendered like this:

## Normal Element Title

![Node Title Edit without Placeholder](http://drupalgap.org/sites/default/files/node-edit-title-no-placeholder.png)

But if we set the element's title to be a placeholder, it will be rendered like this:

## Placeholder Element Title

![Node Title Edit with Placeholder](http://drupalgap.org/sites/default/files/node-edit-title-placeholder.png)

As you can see, this saves precious real estate and can be more UX friendly in certain cases.

## How It's Done

By using `hook_form_alter()` we can change a form element to use a placeholder instead of a label:

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  try {
    if (form_id == 'node_edit') {
      form.elements['title'].title_placeholder = true;
    }
  }
  catch (error) { console.log('my_module_form_alter - ' + error); }
}
```