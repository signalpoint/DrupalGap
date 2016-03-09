DrupalGap comes with a logout block.

![Logout button example](http://www.drupalgap.org/sites/default/files/logout.png)

Here's a typical usage of the block for a `settings.js` file:

```
// The content region.
content: {
  
  /* ... other blocks ... */

  // The logout block.
  logout: {
    access_callback: 'system_logout_block_access_callback'
  }

}
```

The default `access_callback` will only show the logout block when a user is looking at their own profile.

By default, the logout block is themed as a simple logout button. We can adjust the output of the logout block by overriding `theme_logout()` in our theme's JS file:

```
/**
 * Implements theme_logout().
 */
function my_theme_logout(variables) {
  return bl(
    'Exit',
    'user/logout',
    {
      attributes: {
        'data-icon': 'delete',
        'data-iconpos': 'left'
      }
    }
  );
}
```