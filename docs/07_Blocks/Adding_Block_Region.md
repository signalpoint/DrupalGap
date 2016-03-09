Block display settings in DrupalGap are specified in the `settings.js` file. Each theme has its own specific block settings, and inside each theme, the theme's regions specify which blocks to display in it.

```
drupalgap.settings.blocks.my_theme = {

  /* ... */

  /* Footer Region */
  footer:{

    /* My Custom Block */
    my_custom_block:{},

    /* Powered by DrupalGap Block */
    powered_by:{},

  },

  /* ... */

}
```