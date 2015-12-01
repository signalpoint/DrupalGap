

Using a **system settings form**, we can provide configurable settings for our users. For example, in our custom module we can make a form with some basic settings for a game that our users can configure:

![A configuration settings form](http://drupalgap.org/sites/default/files/configuration-settings.png)

## Building the Form

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['my_module_settings_page'] = {
    title: 'Settings',
    page_callback: 'drupalgap_get_form',
    page_arguments: ['my_module_settings_form']
  };
  return items;
}

/**
 * Define our settings form.
 */
function my_module_settings_form(form, form_state) {
  try {
    form.elements['my_module_player_count'] = {
      title: 'Players',
      type: 'select',
      options: {
        1: '1',
        2: '2',
        3: '3',
        4: '4'
      },
      default_value: variable_get('my_module_player_count', '1')
    };
    form.elements['my_module_difficulty'] = {
      title: 'Difficulty',
      type: 'radios',
      options: {
        0: 'Easy',
        1: 'Medium',
        2: 'Hard',
      },
      default_value: variable_get('my_module_difficulty', '0')
    };
    return system_settings_form(form);
  }
  catch (error) {
    console.log('my_module_settings_form - ' + error);
  }
}
```

## Getting a Setting

By using `system_settings_form()`, our form will automatically get a submit button and submit handler attached to it. When the form is submitted, each of our element names will be saved to local storage along with their value. This allows developers to use the settings chosen by the user later within the app.

```
var current_difficulty = variable_get('my_module_difficulty');
if (current_difficulty != 2) {
  alert('Go big or go home!');
  return;
}
```

It is important that we prefix our form elements with `my_module_` when building our form. This will prevent our settings from colliding with any other settings.

Now when our app users navigate to the `my_module_settings_page`, we'll have a configurable settings form for them.

When the user navigates back to the settings form, their previous values will be automatically loaded into the form.

## Altering a System Settings Form

Here's some sample snippets that can go in a hook_form_alter() to add icons to the submit and cancel buttons on a system settings form.

```
if (form_id == 'my_module_settings_form') {
  form.elements['submit']['options']['attributes']['data-icon'] = 'action';
  form.buttons['cancel']['attributes']['data-icon'] = 'back';
}
```