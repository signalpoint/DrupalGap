Here are some typical use cases in the `settings.js` file for an anonymous user popup/dropdown menu, and an authenticated user popup/dropdown menu:

## settings.js

```
// User Menu Anonymous
drupalgap.settings.menus['user_menu_anonymous'] = {
  options: menu_popup_get_default_options(),
  links: [
    {
      title: 'Login',
      path: 'user/login',
      options: {
        attributes: {
          'data-icon': 'lock'
        }
      }
    },
    {
      title: 'Create new account',
      path: 'user/register',
      options: {
        attributes: {
          'data-icon': 'plus'
        }
      }
    }
  ]
};

// User Menu Authenticated
drupalgap.settings.menus['user_menu_authenticated'] = {
  options: menu_popup_get_default_options(),
  links: [
    {
      title: 'My Account',
      path: 'user',
      options: {
        attributes: {
          'data-icon': 'user'
        }
      }
    },
    {
      title: 'Logout',
      path: 'user/logout',
      options: {
        attributes: {
          'data-icon': 'delete'
        }
      }
    }
  ]
};
```

## Menu Block

The corresponding menu block settings would be:

```
user_menu_anonymous: {
  roles: {
    value: ['anonymous user'],
    mode: 'include',
  }
},
user_menu_authenticated: {
  roles: {
    value: ['authenticated user'],
    mode: 'include',
  }
}
```

## Region Menu Links

And finally region menu links would then be:

```
/* Anonymous User Popup Menu Button */
{
  options: {
    popup: true,
    popup_delta: 'user_menu_anonymous',
    attributes: {
      'class': 'ui-btn-right',
      'data-icon': 'user'
    }
  },
  roles: {
    value: ['anonymous user'],
    mode: 'include',
  }
},
/* Authenticated User Popup Menu Button */
{
  options: {
    popup: true,
    popup_delta: 'user_menu_authenticated',
    attributes: {
      'class': 'ui-btn-right',
      'data-icon': 'user'
    }
  },
  roles: {
    value: ['authenticated user'],
    mode: 'include',
  }
}
```