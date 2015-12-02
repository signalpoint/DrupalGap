Like Drupal, DrupalGap is built with English as the default language and provides multi lingual support. Here's a simple example using DrupalGap's `t()` function:

```
var msg = t('Hello');
drupalgap_alert(msg);
```

By default, the word **Hello** would be displayed. We can easily set up additional languages to be used, so DrupalGap will say **Hello** in the appropriate language.

## Set up a new language

Open the `settings.js` file and change the `language_default` value. You'll notice the default value is typically `und`, which indicates an English default.

In the example we'll use Spanish (which has a [language code](https://api.drupal.org/api/drupal/includes!iso.inc/function/_locale_get_predefined_list/7) of `es`):

```
// The Default Language Code
Drupal.settings.language_default = 'es';
```

Next specify which core language file(s) to load using the `settings.js` file. In this example we'll load both the Spanish and Italian language files:

```
// Language Files - locale/[language-code].json
drupalgap.settings.locale = {
  es: { },
  it: { }
};
```

## Providing custom translations

While we hope any translations for DrupalGap core will be contributed back to the community, it is essential custom applications be able to provide their own translations when needed.

To provide custom translations (or contributed module translations) for an application, tell DrupalGap about your custom language codes to load using your module's `.js` file:

```
/**
 * Implements hook_locale().
 */
function my_module_locale() {
  // Tell DrupalGap we have custom Spanish and Italian translations to load.
  return ['es', 'it'];
}
```

### Creating language files

Next up, add language files for each language code you wish to support. For example, create these two empty files:

```
app/modules/custom/my_module/locale/es.json
app/modules/custom/my_module/locale/it.json
```

And finally place the translation objects into the `.json` files:

### es.json

```
{
  "Hello": "Hola",
  "Goodbye": "Adios"
}
```

### it.json

```
{
  "Hello": "Ciao",
  "Goodbye": "Arrivederci"
}
```

During bootstrap, DrupalGap will then load these translations and use them in conjunction with any core translations available for the specified language code(s). Keep in mind any translations provided by `hook_locale()`, will overwrite any core translations for that same string.

That's it! Now you can translate DrupalGap apps, and contributed modules. Be sure to make the necessary changes to the `settings.js` file, as mentioned above.

## Switching languages dynamically

> ...


## Want to help translate?

DrupalGap now has multi lingual support capabilities built into it. Now we're looking for our mutli lingual Drupal friends out there to help translate the SDK for all. Here's a list of language codes that have been started, and a complete list of Drupal's language codes:

- [https://github.com/signalpoint/DrupalGap/tree/7.x-1.x/locale](https://github.com/signalpoint/DrupalGap/tree/7.x-1.x/locale)
- [https://api.drupal.org/api/drupal/includes!iso.inc/function/_locale_get_predefined_list/7](https://api.drupal.org/api/drupal/includes!iso.inc/function/_locale_get_predefined_list/7)

To follow the progress of multi lingual support in DrupalGap, keep a watch on these issues:

- [https://www.drupal.org/node/2484867](https://www.drupal.org/node/2484867)
- [https://github.com/signalpoint/DrupalGap/issues/413](https://github.com/signalpoint/DrupalGap/issues/413)

Instructions for contributing translations to DrupalGap

## On the roadmap...

- provide a contrib module to allow user to select language(s)
- build a web interface to help streamline translation of the DrupalGap SDK and all contrib modules
