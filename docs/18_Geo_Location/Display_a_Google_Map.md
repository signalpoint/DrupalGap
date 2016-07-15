Here's an example that displays a Google Map within a DrupalGap mobile application.

![Google Map](http://drupalgap.org/sites/default/files/google-map.png)

## Google Maps Javascript File

First, we need to include the Google Maps Javascript File in the `index.html` file of our app:

```
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js"></script>
```

This should go after the `drupalgap.css` file inclusion inside the head tag of the `index.html` file.

If you are compiling your app, be sure to replace the `//` in the `src` with `https://` instead.

## Create a Page to Display a Map

Next we'll create a page to handle the display of our map:

```
// Create global variables to hold coordinates and the map.
var _my_module_user_latitude = null;
var _my_module_user_longitude = null;
var _my_module_map = null;

/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['map'] = {
      title: 'Map',
      page_callback: 'my_module_map',
      pageshow: 'my_module_map_pageshow'
    };
    return items;
  }
  catch (error) { console.log('my_module_menu - ' + error); }
}

/**
 * The map page callback.
 */
function my_module_map() {
  try {
    var content = {};
    var map_attributes = {
      id: 'my_module_map',
      style: 'width: 100%; height: 320px;'
    };
    content['map'] = {
      markup: '<div ' + drupalgap_attributes(map_attributes) + '></div>'
    };
    return content;
  }
  catch (error) { console.log('my_module_map - ' + error); }
}

/**
 * The map pageshow callback.
 */
function my_module_map_pageshow() {
  try {
    navigator.geolocation.getCurrentPosition(
      
      // Success.
      function(position) {

        // Set aside the user's position.
        _my_module_user_latitude = position.coords.latitude;
        _my_module_user_longitude = position.coords.longitude;
        
        // Build the lat lng object from the user's position.
        var myLatlng = new google.maps.LatLng(
          _my_module_user_latitude,
          _my_module_user_longitude
        );
        
        // Set the map's options.
        var mapOptions = {
          center: myLatlng,
          zoom: 11,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          },
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
          }
        };
        
        // Initialize the map, and set a timeout to resize properly.
        _my_module_map = new google.maps.Map(
          document.getElementById("my_module_map"),
          mapOptions
        );
        setTimeout(function() {
            google.maps.event.trigger(_my_module_map, 'resize');
            _my_module_map.setCenter(myLatlng);
        }, 500);
        
        // Add a marker for the user's current position.
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: _my_module_map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        
      },
      
      // Error
      function(error) {
        
        // Provide debug information to developer and user.
        console.log(error);
        drupalgap_alert(error.message);
        
        // Process error code.
        switch (error.code) {

          // PERMISSION_DENIED
          case 1:
            break;

          // POSITION_UNAVAILABLE
          case 2:
            break;

          // TIMEOUT
          case 3:
            break;

        }

      },
      
      // Options
      { enableHighAccuracy: true }
      
    );
  }
  catch (error) {
    console.log('my_module_map_pageshow - ' + error);
  }
}
```

### setTimeout()

If you're experiencing problems with the map, you may have to [use a setTimeout() approach](https://www.drupal.org/node/2288843#comment-8997033).

### Google Map with 100% Height

Here's a little hack that can go in a `page_callback` function to dynamically set the height of the map based on the device's window height:

```
// Figure out the map's height from the device window height.
var window_height = $(window).height();
var map_height = window_height - 92; // = footer (px) + header (px)
var map_attributes = {
  id: 'my_module_map_map',
  style: 'width: 100%; height: ' + map_height + 'px;'
};
content['map'] = {
  /* ... map stuff goes here ... */
};
```

Depending on how many headers, footers, navbars, etc are on your page, you'll have to tweak the pixel count accordingly. You'll most likely need some CSS like this too:

```
#map .ui-content {
  padding: 0em;
}
```

### Google Maps shows Gray Area

Sometimes the Google Map will be rendered with large grayed out areas. You may have to use a `setTimeout()` call to trigger a map resize after initializing the map in the pageshow callback:

```
setTimeout(function() {
    google.maps.event.trigger(_my_module_map, 'resize');
}, 500);
```