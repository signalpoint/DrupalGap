## Images Hosted on a Drupal Site

Say for example we wanted to display an image available on our Drupal site. In this example, the image is available here:

`http://drupalgap.org/sites/default/files/logo-64x64.jpg`

In Drupal, the `sites/default/files` directory is the default location for uploaded files. However, Drupal uses an alias when saving the path of our image. For example, the image above has an equivalent Drupal path of:

`public://logo-64x64.jpg`

With this path, we can display the image in our mobile app. First, DrupalGap needs to know what the `public` path is. By default, we assume it is `sites/default/files` and can configure it in our `settings.js` file, if necessary:

```
// Public Files Directory Path
drupalgap.settings.file_public_path = 'sites/default/files';
```

Now we can render images hosted on our Drupal site within our mobile application. Here are a few techniques to render an image:

### Render Array

```
var content = {
  my_custom_image:{
    theme:'image',
    path:drupalgap_image_path('public://logo-64x64.jpg'),
    alt:'DrupalGap Logo',
    title:'DrupalGap'
  }
};
return content;
```

### theme('image', ...)

```
var image = {
  path:drupalgap_image_path('public://logo-64x64.jpg'),
  alt:'DrupalGap Logo',
  title:'DrupalGap'
};
var html = theme('image', image);
return html;
```

## Images Hosted Within the Mobile Application

If we have a custom module or theme, we may want to provide some images with them for our mobile app. For example, say our module had an image located here:

`app/modules/custom/my_module/my_image.jpg`

We could then display that image in our mobile application using a few techniques.

### Render Array

```
var image_path = drupalgap_get_path('module', 'my_module') + '/my_module.jpg';
var content = {
  my_custom_image:{
    theme:'image',
    path:image_path,
    alt:'My Image Alt',
    title:'My Image Title'
  }
};
return content;
```

### theme('image', ...)

```
var image_path = drupalgap_get_path('module', 'my_module') + '/my_module.jpg';
var image = {
  path:image_path,
  alt:'My Image Alt',
  title:'My Image Title'
};
var html = theme('image', image);
return html;
```

## Images Hosted on an External Website

Sometimes we want to display an image that isn't hosted on our Drupal website or saved locally in our mobile app. We can display images hosted on external websites within DrupalGap (provided the website's server isn't configured to disallow it). Here are some techniques:

### Render Array

```
var content = {
  my_custom_image:{
    theme:'image',
    path:'http://tylerfrankenstein.com/sites/default/files/frankenstein-drupal.png',
    alt:'Avatar',
    title:'FrankenDrupal'
  }
};
return content;
```

### theme('image', ...)

```
var image = {
  path:'http://tylerfrankenstein.com/sites/default/files/frankenstein-drupal.png',
  alt:'Avatar',
  title:'FrankenDrupal'
};
var html = theme('image', image);
return html;
```