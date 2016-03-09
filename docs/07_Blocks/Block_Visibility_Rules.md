Sometimes we'll want to have a block only show up on certain pages, or maybe for certain user roles. Or maybe we want the block NOT to show up on certain pages, or for certain user roles.

With block visibility rules, we can specify where our blocks show up, or who they show up for.

- Certain Page(s)
- Certain User Role(s)
- Custom access_callback Function

Here are some examples of block visibility rules placed into the `settings.js` file:

## Show Block in Content Region, only on User Login and Registration Forms

```
drupalgap.settings.blocks.my_theme = {

  /* ... */

  /* Content Region */
  content: {

    /* ... */

    /* My Custom Block */
    my_custom_block: {

      /* ... other block settings ... */

      pages: {
        value: ['user/login', 'user/register'],
        mode: 'include'
      },

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
  roles: {
    value: ['anonymous user'],
    mode: 'include'
  }
}
```

On the flip side, here's the same thing but with an exclude mode:

```
my_custom_block: {
  roles: {
    value: ['authenticated user'],
    mode: 'exclude'
  }
}
```

## Wildcards in Visibility Rules

With wildcards "*" we can set the visibility on a block across pages with arguments. For example, a typical node page has a path of `node/123`, and another node may have a path of `node/456`. If we wanted our block to be visible on all node pages, we can use the wildcard visibility rule `node/*` to use this rule across all node page paths.

```
/* ... */

my_custom_block: {
  pages: {
    value: ['node/*'],
    mode: 'include'
  }
}

/* ... */
```

## Custom access_callback function

At times, the default visibility rules (pages and roles) provided by DrupalGap isn't flexible enough to determine a block's desired visibility. Luckily, we can attach a custom `access_callback` function name to our block in `settings.js`. Here's a simple example:

```
/* ... */

my_custom_block: {
  access_callback: 'my_custom_block_access_callback'
}

/* ... */
```

Now if we were to implement the function like so in our custom module's JS file...

```
function my_custom_block_access_callback(options) {

  //console.log(options); // Un-comment to reveal info about the current context.

  // Only show the block to logged in users on the pizza page.
  if (Drupal.user.uid && options.path == 'pizza') {
    return true;
  }
  return false;

}
```

The function will be used to determine if the block is visible or not.
