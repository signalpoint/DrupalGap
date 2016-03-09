See the [Node Services](../Services/Node_Services) page for more information.

## node_load()

```
node_load(123, {
  success:function(node){
    alert("Loaded " + node.title);
  }
});
```

## node_save()

**Save a New Node**

```
var node = {
  title:"Hello World",
  type:"article"
};
node_save(node, {
  success:function(result) {
    alert("Saved new node #" + result.nid);
  }
});
```

**Update an Existing Node**

```
var node = {
  nid:123,
  title:"New Title"
};
node_save(node, {
  success:function(result) {
    alert("Updated existing node #" + result.nid);
  }
});
```

## node_delete()

```
node_delete(123, {
    success:function(result){
      if (result[0]) {
        alert("Node deleted!");
      }
    }
});
```

## node_index()

**Get the Most Recent Nodes of Type Article**

```
var query = {
  parameters: {
    'type': 'article'
  }
};
node_index(query, {
    success:function(nodes){
      alert('Indexed ' + nodes.length + ' node(s)!');
    }
});
```
