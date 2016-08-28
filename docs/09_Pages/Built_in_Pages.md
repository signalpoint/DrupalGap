DrupalGap comes prepackaged with many pages that can automatically be displayed in a mobile application.

- Node Pages (`node/123`)
- Node Edit Form (`node/123/edit`)
- User Login (`user/login`)
- User Registration (`user/register`)
- User Forgot Password (`user/password`)
- User Profile Pages (`user/123`)
- User Account Edit Form (`user/123/edit`)
- Taxonomy Term Pages (`taxonomy_term/123`)
- Taxonomy Term Edit Form (`taxonomy_term/123/edit`)
- Site-Wide Contact Form (`contact`)
- User Contact Forms (`user/123/contact`)

Notice how the pages built into DrupalGap use the same paths that we're used to in Drupal?

## Custom Pages and Forms for Entities

Although DrupalGap has these built in pages, it can be very beneficial to have complete control over the display and editing of your entities. These topics have great examples for how easy it is to customize your own pages and forms:

- [Rendering Entities](../Entities/Rendering_Entities)
- [Editing Entities](../Entities/Editing_Entities)

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
