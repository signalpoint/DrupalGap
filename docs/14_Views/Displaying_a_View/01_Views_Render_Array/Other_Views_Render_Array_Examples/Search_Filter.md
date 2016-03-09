A list of many results is uncomfortable. jQuery Mobile offers a feature that can help, a **Search Filter**. Also check out the [Autocomplete](../../Forms/Form_Elements/Autocomplete) page for related info.

To use them you just need to add a few lines of code.

Inside of the attributes just add `'data-filter': 'true'` as noted here.

```
content['location_results'] = {
  theme: 'jqm_item_list',
  items: [],
  attributes: {
    id: 'location_results_list',
    'data-filter': 'true',
  }
};
```

![Search filter listing](http://www.drupalgap.org/sites/default/files/styles/large/public/pictures/picture-657-1412964614.jpg)