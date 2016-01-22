## Images Hosted on a Drupal Site

Say for example we wanted to display an image available on our Drupal site. In this example, the image is available here:

`http://drupalgap.org/sites/default/files/logo-64x64.jpg`

In Drupal, the `sites/default/files` directory is the default location for uploaded files. However, Drupal uses an alias when saving the path of our image. For example, the image above has an equivalent Drupal path of:

`public://logo-64x64.jpg`

With this path, we can display the image in our mobile app. First, DrupalGap needs to know what the `public` path is. By default, we assume it is `sites/default/files` and can configure it in our `settings.js` file, if necessary:

```
// Drupal files directory path(s)
drupalgap.settings.files = {
  publicPath: 'sites/default/files',
  privatePath: null
};
```

Now we can render images hosted on our Drupal site within our mobile application. Here are a few techniques to render an image:

### Render Element

```
var content = {};
content['my_custom_image'] = {
  _theme: 'image',
  _path: 'public://logo-64x64.jpg',
  _alt: 'DrupalGap Logo',
  _title: 'DrupalGap'
};
return content;
```

### dg.theme('image', ...)

```
var image = {
  _path: 'public://logo-64x64.jpg',
  _alt: 'DrupalGap Logo',
  _title: 'DrupalGap'
};
var html = dg.theme('image', image);
return html;
```

## Images Hosted Within the Application

For example, say our app had an image located here within its `www` directory:

`img/my-custom-img.jpg`

We could then display that image in our mobile application using a few techniques.

### Render Element

```
var content = {};
content['my_custom_image'] = {
  _theme: 'image',
  _path: 'img/my-custom-img.jpg',
  _alt: 'My Image Alt',
  _title: 'My Image Title'
};
return content;
```

### dg.theme('image', ...)

```
var image = {
  _path: 'img/my-custom-img.jpg',
  _alt: 'My Image Alt',
  _title: 'My Image Title'
};
var html = dg.theme('image', image);
return html;
```

## Images Hosted on an External Website

Sometimes we want to display an image that isn't hosted on our Drupal website or saved locally in our mobile app. We can display images hosted on external websites within DrupalGap (provided the website's server isn't configured to disallow it). Here are some techniques:

### Render Element

```
var content = {};
content['my_custom_image'] = {
  _theme: 'image',
  _path: 'http://tylerfrankenstein.com/sites/default/files/frankenstein-drupal.png',
  _alt: 'Avatar',
  _title: 'FrankenDrupal'
};
return content;
```

### dg.theme('image', ...)

```
var image = {
  _path: 'http://tylerfrankenstein.com/sites/default/files/frankenstein-drupal.png',
  _alt: 'Avatar',
  _title: 'FrankenDrupal'
};
var html = dg.theme('image', image);
return html;
```
