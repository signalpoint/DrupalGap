By adding this snippet in a `pageshow` handler, I was able to simulate a pull to refresh feature:

```
// Set aside the thresholds so they can be reset later.
var _scrollSupressionThreshold = $.event.special.swipe.scrollSupressionThreshold;
var _horizontalDistanceThreshold = $.event.special.swipe.horizontalDistanceThreshold;
var _verticalDistanceThreshold = $.event.special.swipe.verticalDistanceThreshold;

// Adjust the thresholds for a vertical swipe.
$.event.special.swipe.scrollSupressionThreshold = 5;
$.event.special.swipe.horizontalDistanceThreshold = 1;
$.event.special.swipe.verticalDistanceThreshold = 128;

// Listen for the swipe event...
$('#' + drupalgap_get_page_id() + ' div[data-role="header"]').on("swipe", function() {

  // Reset thresholds.
  $.event.special.swipe.scrollSupressionThreshold = _scrollSupressionThreshold;
  $.event.special.swipe.horizontalDistanceThreshold = _horizontalDistanceThreshold;
  $.event.special.swipe.verticalDistanceThreshold = _verticalDistanceThreshold;

  // Reload the current page.
  drupalgap_goto(drupalgap_path_get(), { reloadPage: true });

});
```