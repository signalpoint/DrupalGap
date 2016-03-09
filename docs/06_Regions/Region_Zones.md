It's possible for us to display [blocks](../Blocks) before or after a region in our theme. This allows us to insert content outside of a region in our theme. This is particularly useful for [jQuery Mobile Panels](http://api.jquerymobile.com/panel/).

By utilizing the `_prefix` or `_suffix` object variable on a region's settings, we can display blocks before or after a region.

## 1. Create a custom block

[Learn more](../Blocks/Create_a_Custom_Block) about creating custom blocks.

## 2. Add the block to the settings.js file

In this example we'll place `my_custom_block` within the `_prefix` of the `header` region of our theme:

```
drupalgap.settings.blocks.my_theme = {
  header: {
    _prefix: {
      my_custom_block: { }
    },
    /* ... region blocks ... */
  },
  /* ... other regions ... */
}
```

## 3. Set block visibility rules (optional)

We can then optionally use block visibility rules to control when this block should be rendered.
