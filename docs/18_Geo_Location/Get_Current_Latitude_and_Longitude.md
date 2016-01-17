In this example, we'll create a page, and when the page is shown it will attempt to retrieve our current position, then display it in an alert dialog, or display the error that occurred.

```
/**
 * Defines custom routes for my module.
 */
my_module.routing = function() {
  var routes = {};
  routes["my_module.geolocation"] = {
    "path": "/my-module-geolocation",
    "defaults": {
      "_controller": my_module_geolocation_page_controller,
      "_title": "Hello World"
    }
  };
  return routes;
};

/**
 * My geolocation page controller.
 */
function my_module_geolocation_page_controller() {
  return new Promise(function(ok, err) {

    var content = {};

    // Get the current position...
    navigator.geolocation.getCurrentPosition(
    
      // Success
      function (position) {

        // Inspect the position coordinates.
        //console.log(position.coords);

        // Show a generic alert message.
        //dg.alert(
        //    'Latitude: '          + position.coords.latitude          + '\n' +
        //    'Longitude: '         + position.coords.longitude         + '\n' +
        //    'Altitude: '          + position.coords.altitude          + '\n' +
        //    'Accuracy: '          + position.coords.accuracy          + '\n' +
        //    'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        //    'Heading: '           + position.coords.heading           + '\n' +
        //    'Speed: '             + position.coords.speed             + '\n' +
        //    'Timestamp: '         + position.timestamp                + '\n'
        //);

        // Show a bullet list of coordinate data...

        // Iterate over each coordinate and place them in a list.
        var pieces = ['latitude', 'longitude', 'altitude', 'accuracy', 'altitudeAccuracy', 'heading', 'speed'];
        var items = [];
        for (var i = 0; i < pieces.length; i++) {
          var piece = pieces[i];
          items.push(piece + ': ' + position.coords[piece])
        }

        // Show the date and time the location was retrieved.
        var d = new Date(position.timestamp);
        content['user-location-date'] = {
          _markup: d.toDateString()
        };

        // Show the pieces of the coordinates.
        content['user-location'] = {
          _theme: 'item_list',
          _items: items
        };

        ok(content);

      },
      
      // Error
      function (error) {
        dg.alert(
            'Code: '    + error.code    + '\n' +
            'Message: ' + error.message + '\n'
        );
        ok();
      }
      
    );

  });
}
```

You could then navigate to this new page in the app to test it out. For example, set the front page with the route of your new page in the `settings.js` file:

```
// Set Front Page
drupalgap.settings.front = 'my-module-geolocation';
```
