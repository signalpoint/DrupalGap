To create a custom block, implement the following two hooks in a custom module.

```
/**
 * Implements hook_block_info().
 */
function my_module_block_info() {
  try {
    var blocks = {};
    blocks['my_custom_block'] = {
      delta: 'my_custom_block',
      module: 'my_module'
    };
    return blocks;
  }
  catch (error) { console.log('my_module_block_info - ' + error); }
}

/**
 * Implements hook_block_view().
 */
function my_module_block_view(delta, region) {
  try {
    var content = '';
    if (delta == 'my_custom_block') {
      // Show today's date for the block's content.
      var d = new Date();
      content = '<h2><center>' + d.toDateString() + '</center></h2>';
    }
    return content;
  }
  catch (error) { console.log('my_module_block_view - ' + error); }
}
```

Next, if we [add the block](Blocks/Adding_Block_Region) to a region the `app/settings.js` file, we'll be able to see the custom block. For example, if we placed the block in the `footer` region above the `powered_by` block, it may look something like this:

![Custom Block in DrupalGap](http://drupalgap.org/sites/default/files/custom-block.png)