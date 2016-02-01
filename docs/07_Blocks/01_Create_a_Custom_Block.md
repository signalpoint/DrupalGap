To create a custom block, add the following function to your module's object:

```
/**
 * Defines blocks for my_module.
 */
my_module.blocks = function() {
  var blocks = {};
  
  blocks['my_module_custom_block'] = {
    build: function () {
      return new Promise(function(ok, err) {
        var element = {};
        element['my_markup'] = {
          markup: '<p>Hello World</p>'
        };
        ok(element);
      });
    }
  };
  
  return blocks;
};
```

Next, if we [add the block](Blocks/Adding_Block_Region) to a region the `settings.js` file, we'll be able to see the custom block.
