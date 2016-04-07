Since our Drupal website most likely employs some type of Captcha (Mollom, ReCAPTCHA), we may run into problems inside of DrupalGap when interacting with forms backed by Captcha on the Drupal end. Some common forms that may run into this problem are:

- User Registration
- Contact
- User Contact

Luckily, we can get around this with some form alterations. This code will live on your Drupal site, in a custom `.module` file, not inside of a `.js` file in your mobile app. ([How to create a Drupal module?](https://drupal.org/developing/modules/7))

First we need to identify which forms we want to disable the captcha on when coming from DrupalGap. Then attach an after build handler to the form, and then implement the after build handler to remove the captcha.

```
<?php

/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(&$form, &$form_state, $form_id) {
  $forms = array(
    'user_register_form',
    'contact_site_form',
    'contact_personal_form'
  );
  if (arg(0) == 'drupalgap' && in_array($form_id, $forms)) {
    $form['#after_build'][] =
      'my_module_form_captcha_after_build';
  }
}

/**
 * An after build handler to remove captcha from forms.
 */
function my_module_form_captcha_after_build($form, &$form_state) {
  // ReCAPTCHA
  if (isset($form['captcha'])) { unset($form['captcha']); }
  // Mollom
  if (isset($form['mollom'])) { unset($form['mollom']); }
  return $form;
}
```

## Honeypot

The Honeypot module can cause problems for certain forms, so you can manually remove it from DrupalGap in a custom Drupal module:

```
/**
 * Implements hook_form_alter().
 */
function ngt_form_alter(&$form, $form_state, $form_id) {
 
  // Disable honeypot on the DrupalGap user registration form.
  if ($form_id == 'user_register_form' && arg(0) == 'drupalgap' && isset($form['honeypot_time'])) {
    unset($form['honeypot_time']);
  }

}
```
