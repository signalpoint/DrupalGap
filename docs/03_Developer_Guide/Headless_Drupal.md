With DrupalGap, we can easily create a **Headless Drupal** application. This means we can let Drupal run *"in the background"*, and the user experience can be handled entirely by the application.

```
cd /var/www
mkdir headless
cd headless
```

From here we'd install Drupal in a sub directory, for example:

`/var/www/headless/drupal/...`

Now we can install the DrupalGap SDK in the root folder of our website:

`/var/www/headless/...`

Then open the `settings.js` file in the DrupalGap SDK:

`/var/www/headless/app/settings.js`

Then set the site path to the Drupal directory:

`Drupal.settings.site_path = 'http://localhost/headless/drupal';`

And set the mode for a web app:

`drupalgap.settings.mode = 'web-app';`

Then we are up and running with a headless Drupal application!

`http://localhost/headless`