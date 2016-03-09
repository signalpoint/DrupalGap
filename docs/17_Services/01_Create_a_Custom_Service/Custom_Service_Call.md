Now that we've [created a custom service resource](Create_a_Custom_Service_Call), there are a few ways we can make a call to it. The first method (recommended) is to make our Service Resource available through the DrupalGap Services API. This will allow us (and others) to more easily call the Service Resource. The second method, is to call the Service Resource directly via the DrupalGap Services API.

## Method 1: DrupalGap Services API (recommended)

First, we need to [create a custom DrupalGap module](../Modules/Create_a_Custom_Module), then add code like this to our module:

```
function my_module_get_user_count(options) {
  try {
    options.method = 'POST';
    options.path = 'my_module_resources/get_user_count.json';
    options.service = 'my_module';
    options.resource = 'get_user_count';
    Drupal.services.call(options);
  }
  catch (error) {
    console.log('my_module_get_user_count - ' + error);
  }
}
```

Now we (and others) can make a call to our custom service resource in our mobile app by using code like this:

```
my_module_get_user_count({
    success: function(result) {
      var user_count = result[0];
      var msg = 'There are ' + user_count + ' registered user(s)!'
      drupalgap_alert(msg);
    }
});
```

## Method 2: Direct Call

Alternatively, we can directly call our Service Resource through the DrupalGap Services API. Place code like this in a custom module to make the call:

```
Drupal.services.call({
    method: 'POST',
    path: 'my_module_resources/get_user_count.json',
    success: function(result) {
      var user_count = result[0];
      var msg = 'There are ' + user_count + ' registered user(s)!'
      drupalgap_alert(msg);
    }
});
```

Method 2 does work, except we have to always declare our "method" ("type") and "path" which isn't as easy to maintain as method 1.

## Setting the Content-type on the Request Header

jDrupal does its best to predict the `Content-type` to use on the request header of a service call. Sometimes you may want to override it before making your call, for example:

```
// ...
options.contentType = 'application/x-www-form-urlencoded';
Drupal.services.call(options);
```