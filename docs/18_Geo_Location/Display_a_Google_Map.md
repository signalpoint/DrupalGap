Here's an example that displays a Google Map within a DrupalGap mobile application.

## Google Maps Javascript File

First, we need to include the Google Maps Javascript File in the `index.html` file of our app:

```
<!-- Google Maps -->
<script src="https://maps.googleapis.com/maps/api/js"></script>
```

This should go in the `<head>` of the of the `index.html` file (after the inclusion of the `drupalgap.min.js` file) for the app.

## Create a Page to Display a Map

Next we'll create a page to handle the display of our map:

```
// Create global variables to hold coordinates and the map.
my_module.userLatitude = null;
my_module.userLongitude = null;
my_module.map = null;

/**
 * Defines custom routes for my module.
 */
my_module.routing = function() {
  var routes = {};
  routes["my_module.map"] = {
    "path": "/map",
    "defaults": {
      "_title": "Map",
      "_controller": my_module_map
    }
  };
  return routes;
};

/**
 * The map page controller.
 */
function my_module_map() {
  return new Promise(function(ok, err) {
  
    var element = {};
    var map_attributes = {
      id: 'my-module-map',
      style: 'width: 100%; height: 320px;'
    };
    element['map'] = {
      _markup: '<div ' + dg.attributes(map_attributes) + '></div>',
      _postRender: [my_module_map_post_render]
    };
    ok(element);

  });
}

/**
 * The map post render.
 */
function my_module_map_post_render() {
  navigator.geolocation.getCurrentPosition(

      // Success.
      function(position) {

        // Set aside the user's position.
        my_module.userLatitude = position.coords.latitude;
        my_module.userLongitude = position.coords.longitude;

        // Build the lat lng object from the user's position.
        var myLatlng = new google.maps.LatLng(
            my_module.userLatitude,
            my_module.userLongitude
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
        my_module.map = new google.maps.Map(
            document.getElementById("my-module-map"),
            mapOptions
        );
        setTimeout(function() {
          google.maps.event.trigger(my_module.map, 'resize');
          my_module.map.setCenter(myLatlng);
        }, 500);

        // Add a marker for the user's current position.
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: my_module.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

      },

      // Error
      function(error) {

        // Provide debug information to developer and user.
        console.log(error);
        dg.alert(error.message);

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

```
