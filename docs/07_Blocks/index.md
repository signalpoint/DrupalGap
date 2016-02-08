

Blocks are located within regions, within a [theme](Themes). The content displayed inside the block is decided by whomever created the block.

## System Blocks

By default, DrupalGap comes packaged with a handful of blocks to make our lives easier. Here are their machine names:

- admin_menu
- logo
- main (*used to display the content of the current page*)
- main_menu
- title (*used to display the page title*)
- powered_by
- user_login
- user_menu

### How to Remove the "Powered by: DrupalGap" Block

To remove the block from our app, open the `settings.js` file. Then for example, remove the `powered_by` block from the footer region within our theme:

```
dg.settings.blocks[dg.config('theme').name] = {
  /* ... */
  footer:{
    my_custom_block:{},
    powered_by:{}, /* delete this line */
  }
  /* ... */
};
```
