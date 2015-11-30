

Blocks are located within regions, within a [theme](Themes). The content displayed inside the block is decided by whomever created the block.

## System Blocks

By default, DrupalGap comes packaged with a few different system blocks. Here are their machine names (more commonly referred to as "delta" values):

- main (*used to display the content of the current page*)
- logo
- title (*used to display the page title*)
- powered_by

## Remove the "Powered by: DrupalGap" Block

To delete the "Powered by: DrupalGap" Block from our mobile app, open the settings.js file. Then for example, remove the 'powered_by' block from the footer region within our theme:

```
drupalgap.settings.blocks.my_theme = {
  /* ... */
  footer:{
    my_custom_block:{},
    powered_by:{}, /* delete this line */
  }
  /* ... */
};
```
