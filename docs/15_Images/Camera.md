The [camera plugin](https://github.com/apache/cordova-plugin-camera) only works in `phonegap` mode (configured via `settings.js`) and requires this plugin be installed:

`cordova plugin add org.apache.cordova.camera`

DrupalGap has built in support for image fields provided by Drupal Core. Otherwise, you can manually invoke the camera using the following techniques:

## Camera Buttons

```
// Open camera.
var html = bl('My camera', null, {
    attributes: {
      'data-icon': 'camera',
      'data-iconpos': 'right',
      onclick: 'my_module_camera_click()'
    }
});

// Photo library.
var html = bl('My photos', null, {
    attributes: {
      'data-icon': 'camera',
      'data-iconpos': 'right',
      onclick: 'my_module_photos_click()'
    }
});
```

## Open Camera

```
function my_module_camera_click() {
  try {
    navigator.camera.getPicture(

      // Success
      function(imageURI) {
        drupalgap_toast(t('Picture saved!'));
      },

      // Error
      function(message) { console.log(message); },

      // Settings
      {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
      }

    );
  }
  catch (error) {
    console.log('my_module_camera_click - ' + error);
    }
}
```

## Open Photo Library

```
function my_module_photos_click() {
  try {
    navigator.camera.getPicture(

      // Success
      function(imageURI) { },

      // Error
      function(message) { console.log(message); },

      // Settings
      {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      }

    );
  }
  catch (error) {
    console.log('my_module_photos_click - ' + error);
  }
}
```