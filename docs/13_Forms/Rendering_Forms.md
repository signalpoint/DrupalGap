#### As a Render Element

```
var element = {};
element.search = {
  _theme: 'form',
  _id: 'MyModuleSayHelloForm'
};
ok(element);
```

#### Placing the Form in a Block

In a [custom block's](../Blocks/Create_a_Custom_Block) `build` function, we can provide a form to be rendered within the block:

```
return new Promise(function(ok, err) {

  // Load the form, add it to DrupalGap, render it and then return it.
  dg.addForm('MyModuleSayHelloForm', dg.applyToConstructor(MyModuleSayHelloForm)).getForm().then(ok);
  
  // OR...
  
  // @TODO - you can probably use this instead for cleaner code, someone needs to test this though.
  var element = {};
  element.search = {
    _theme: 'form',
    _id: 'MyModuleSayHelloForm'
  };
  ok(element);

});
```
