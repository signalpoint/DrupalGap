The *Bucket Widget* is a very powerful widget. It allows you to place an empty `div` on the page, make an *async* call (like fetching data from Drupal, or requesting GPS coordinates), then render something and inject it into the empty div.
 
```
/**
 * Example page _controller.
 */
example.pageNode = function(nid) {
  var element = {};
  
  // Place an empty bucket on the page.
  element.foo = {
    _theme: 'bucket',
    _grab: function() {
      return new Promise(function(fill, dump) {
      
        // Grab the node from the server, and fill the bucket with the node title.
        dg.nodeLoad(nid).then(function(node) {
          fill(node.getTitle());
        });
  
      });
    }
  };
  
  return element;
};
```

By default a bucket uses a `div` wrapper, but you can override the `_format` property to set your own wrapper:

```
  // ...
  _theme: 'bucket',
  _format: 'article'
  // ...
```
