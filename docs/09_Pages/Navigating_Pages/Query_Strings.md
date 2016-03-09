We can pass along query strings to our pages by placing them in our links:

`l('Pizza', 'pizza?foo=bar');`

Then when we click the **Pizza** link and go to the `pizza` page, we can access the value of `foo` anywhere in our code:

`drupalgap_alert(_GET('foo'));`

Which would then alert the user to `bar`.

This is a very powerful feature for dynamically sending/receiving data as you navigate around the app between pages.