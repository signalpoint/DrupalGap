We can add access control to the routes that define our custom pages. Just add a `requirements` object to your route:

```
routes["example.hello"] = {
  path: "/hello",
  defaults: {
    _title: "Hello",
    _controller: function() { /* ... */ }
  },
  requirements: {
    /* ... see options below ... */
  }
};
```

## Role Based Access Callback

```
requirements: {
  _role: 'administrator',
}
```

## Custom Access Callback

```
requirements: {
  _custom_access: function() {

    // Only anonymous users can access this page.
    return dg.currentUser().isAnonymous();

  },
}
```
