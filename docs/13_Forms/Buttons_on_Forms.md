

Also checkout the [Button Widget](../Widgets/Buttons) page.

We can add buttons to forms. Buttons are not form elements, which means they don't store any user input. Essentially we use buttons to place UI components we need.

![Buttons on a Form](http://drupalgap.org/sites/default/files/user-login-extra-form-button.png)

Here's an example that places a **Create new account** button on the User Login form, and a **Login to existing account** button on the User Register form:

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  try {
    if (form_id == 'user_login_form') {
      form.buttons['create_new_account'] = {
        title: 'Create new account',
        attributes: {
          onclick: "drupalgap_goto('user/register')"
        }
      };
    }
    else if (form_id == 'user_register_form') {
      form.buttons['login'] = {
        title: 'Login to existing account',
        attributes: {
          onclick: "drupalgap_goto('user/login')"
        }
      };
    }
  }
  catch (error) { console.log('my_module_form_alter - ' + error); }
}
```