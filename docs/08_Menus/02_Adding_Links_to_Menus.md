We can add or edit the links of any menu in DrupalGap using the `app/settings.js` file. For example, say we want to add a few links to the main menu that will link to some internal DrupalGap pages (the page for node 123 and the page for user 1).

![A simple menu on a page](http://drupalgap.org/sites/default/files/about-profile.png)

```
drupalgap.settings.menus['main_menu'] = {
  links: [
    {
      title: 'About',
      path: 'node/123',
      options: {
        attributes: {
          'data-icon': 'info'
        }
      }
    },
    {
      title: 'Profile',
      path: 'user',
      options: {
        attributes: {
          'data-icon': 'star'
        }
      }
    },
  ]
};
```