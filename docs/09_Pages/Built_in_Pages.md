DrupalGap comes prepackaged with many pages that can automatically be displayed in a mobile application. For example, we know our Drupal websites come with the following pages:

- Node Pages
- Node Edit Form
- User Login
- User Registration
- User Profile Pages
- User Account Edit Form
- Taxonomy Term Pages
- Taxonomy Term Edit Form
- Site-Wide Contact Form
- User Contact Forms

So it makes sense to have these same types of pages available withour mobile applications.

## Node Pages

Before displaying a node in our mobile application, we need to set up the [Display Mode](../Entities/Display_Modes) on our node's content type. This allows us to control what fields and labels show up for our content type.

It is possible to override a node's page, and completely customize how it looks.


## Contact Forms

To use contact forms in DrupalGap, download and enable the [Services Contact](https://drupal.org/project/services_contact) module. Verify the following permissions are enabled for the desired user roles on your Drupal site to use these features:

- access site-wide contact form
- access user contact forms

### Site-Wide Contact Form

To use the site-wide contact form, just navigate to the following path in DrupalGap:

`contact`

### Personal Contact Form

To use a personal contact form, just navigate to this example path in DrupalGap:

`user/123/contact`

Replace the 123 with whichever user id to load that user's contact form. The target user must have their personal contact form enabled in their account settings.

## Dealing with CAPTCHA

If you have CAPTCHA (e.g. Mollom, ReCAPTCHA) enabled on your contact form, you must [prevent it from processing the contact form](../Forms/Captcha).
