It's possible to plus multiple menu links in the same region. The `ui-btn-left` and `ui-btn-right` class names control the buttons placement in the region.

## On Opposite Sides

![Opposite Sides](http://drupalgap.org/sites/default/files/region-menu-links-opposite-sides.png)

## On The Same Side

![Same Side](http://drupalgap.org/sites/default/files/region-menu-links-same-side.png)

## The Code

Here's some example code for the `settings.js` file which places the buttons on opposite sides.

```
// Header Region Links
drupalgap.settings.menus.regions['header'] = {
  links:[

    /* ... other links ... */

    /* Food Button */
    {
      title: 'Food',
      path: 'food',
      options: {
        attributes: {
          'data-icon': 'plus',
          'class': 'ui-btn-left'
        }
      }
    },
    /* Drink Button */
    {
      title: 'Drink',
      path: 'drink',
      options: {
        attributes: {
          'data-icon': 'bars',
          'class': 'ui-btn-right'
        }
      }
    }

  ]
};
```

To place the buttons on the same side, set both of their class values to `ui-btn-left` or `ui-btn-right`.