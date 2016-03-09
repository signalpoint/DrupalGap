To get the request new password feature to work in your app, follow these steps:

1. Go to admin/structure/services/list/drupalgap/resources
2. Check the box next to "request_new_password"
3. Click save
4. Flush all of Drupal's caches

That's it! Now your app can be used to request a new password.

## hook_form_alter()

Here's a `hook_form_alter()` snippet that can be used to add a **Request new password** link to the app's user login form. This will just open up the Drupal website's request new password form, so make sure your website is mobile friendly!

```
if (form_id == 'user_login_form') {
  // Add a 'Request new password' link.
  form.suffix += bl(
    'Request new password',
    Drupal.settings.site_path + '/user/password',
    { InAppBrowser: true }
  );
}
```