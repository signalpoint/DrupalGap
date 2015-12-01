> The dev snapshot of the Drupal services module is required

Here's a quick example that uses an autocomplete for taxonomy terms:

```
var html = theme('autocomplete', {
    remote: true,
    custom: true,
    handler: 'index',
    entity_type: 'taxonomy_term',
    vid: 1, /* optional vocabulary id filter */
    value: 'tid',
    label: 'name',
    filter: 'name'
});
```