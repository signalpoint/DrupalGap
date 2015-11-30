

With [jQuery Mobile Icons](http://api.jquerymobile.com/icons/), we can place icons on our menu links.

## Only an Icon, no Text

Using `data-iconpos="notext"` allows us to have a menu link that just show an icon.

![Region Menu Link with no Text](http://drupalgap.org/sites/default/files/region-menu-link-notext.png)

In the example above, we have a region menu link to the home page, and we only show the "home" icon. Here's how that is done:

```
// Header Region Links
drupalgap.settings.menus.regions['header'] = {
  links:[

    /* ... other links ... */

    /* Home Button */
    {
      path: '',
      options: {
        attributes: {
          'data-icon': 'home',
          'data-iconpos': 'notext',
          'class': 'ui-btn-left'
        }
      },
      pages: {
        value: [''],
        mode: 'exclude'
      }
    }

  ]
};
```

## Font Awesome Icons

Relative to your app's www directory (not your Drupal site's www directory):

```
wget https://github.com/commadelimited/jQuery-Mobile-Icon-Pack/archive/master.zip
unzip master.zip
mv jQuery-Mobile-Icon-Pack-master/dist/ .
rm -rf jQuery-Mobile-Icon-Pack-master
```

Add this to your `index.html` file:

`<link rel="stylesheet"  href="dist/jqm-icon-pack-fa.css" />`

Now you can use the `data-icon` attribute as usual. [Here's a list of the icons in action](http://andymatthews.net/code/jQuery-Mobile-Icon-Pack/).

For more information: [https://github.com/commadelimited/jQuery-Mobile-Icon-Pack](https://github.com/commadelimited/jQuery-Mobile-Icon-Pack)
