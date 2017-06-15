We can add access control to the routes that define our custom pages. Just add a `requirements` object to your route:

```
routes["example.hello"] = {
  path: "/hello",
  defaults: {
    _title: "Hello",
    _controller: function() { /* ... */ }
  },
  requirements: {
    _role: 'administrator'
  }
};
```
