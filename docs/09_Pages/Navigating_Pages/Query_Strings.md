We can pass along query strings to our pages by placing them in our links:

```
dg.l('Pizza', 'pizza', {
  _query: {
    foo: 'bar'
  }
});
```

Then when we click the **Pizza** link and go to the `pizza` page, we can access the value of `foo` anywhere in our code:

```
dg.alert(dg._GET('foo'));
```

Which would then alert the user to `bar`.

This is a handy feature for dynamically sending/receiving data as you navigate around the app between pages.
