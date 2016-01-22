To create a custom block, add the following function to your module's object:

```
/**
 * Defines blocks for my module.
 */
my_module.blocks = function() {
  var blocks = {};
  
  blocks['my_module_custom_block'] = {
    build: function () {
      return new Promise(function(ok, err) {
        var content = {};
        content['my_markup'] = {
          markup: '<p>Hello World</p>'
        };
        ok(content);
      });
    }
  };
  
  return blocks;
};
```

Next, if we [add the block](Blocks/Adding_Block_Region) to a region the `settings.js` file, we'll be able to see the custom block. For example, if we placed the block in the `footer` region above the `powered_by` block, it may look something like this:

![Custom Block in DrupalGap](http://drupalgap.org/sites/default/files/custom-block.png)