Sometimes we'll want to have a block only show up on certain pages, or maybe for certain user roles. Or maybe we want the block NOT to show up on certain pages, or for certain user roles.

With block visibility rules, we can specify where our blocks show up, or who they show up for.

- Certain Page(s)
- Certain User Role(s)
- Custom access_callback Function

Here are some examples of block visibility rules placed into the `settings.js` file:

## Show Block in Content Region, only for logged in users

```
dg.settings.blocks[dg.config('theme').name] = {

  /* ... */

  /* Content Region */
  content: {

    /* ... */

    /* My Custom Block */
    my_custom_block: {

      /* ... other block settings ... */
      _roles: [
        { target_id: 'authenticated', visible: true }
      ]

      /* ... other block settings ... */

    },

    /* ... */

  },

  /* ... */

};
```

## User Role Based Visibility Rules

Here's an example that shows a block only for logged out users (aka anonymous users):

```
my_custom_block: {
  _roles: [
    { target_id: 'anonymous', visible: true }
  ]
}
```

On the flip side, here's an example that shows a block only for logged in users (aka authenticated users):

```
my_custom_block: {
  _roles: [
    { target_id: 'authenticated', visible: true }
  ]
}
```

Here's an example that hides a block from administrators:

```
my_custom_block: {
  _roles: [
    { target_id: 'administrator', visible: false }
  ]
}
```

## Route Based Visibility Rules

```
my_custom_block: {

  // Hide the block on the welcome page from anonymous users.
  _routes: [
    { key: 'my_module.welcome', target_id: 'anonymous', visible: false }
  ]
  
}
```

## Access Callback Based Visibility Rules

```
my_custom_block: {

  // Hide the block from anonymous users on the front page on Mondays only.
  _access: function() {
    var d = new Date();
    return !(dg.currentUser().isAnonymous() && dg.isFrontPage() && d.getDay() == 1);
  }
  
}
```

## Wildcards in Visibility Rules

...
