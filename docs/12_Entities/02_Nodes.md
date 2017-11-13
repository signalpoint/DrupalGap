## Load a Node

```
jDrupal.nodeLoad(123).then(function(node) {
  var msg = 'Loaded node: ' + node.getTitle();
  console.log(msg);
});
```

## Save a Node

### Save a New Node

```
var node = new jDrupal.Node({
  type: [ { target_id: 'article' } ],
  title: [ { value: 'Hello World' }]
});
node.save().then(function() {
  var msg = 'Saved new node # ' + node.id();
  console.log(msg);
});
```

### Update an Existing Node

```
// First, load the node...
jDrupal.nodeLoad(123).then(function(node) {

  // then change its title...
  node.setTitle('Goodbye world');

  // and then save the changes.
  node.save().then(function() {
    var msg = 'Saved ' + node.getTitle();
    console.log(msg);
  });

});
```

## Delete a Node

```
// First, load the node...
jDrupal.nodeLoad(123).then(function(node) {

  // then delete it.
  node.delete(123).then(function() {
    console.log('Node deleted!');
  });

});
```
