## Load a Comment

```
jDrupal.commentLoad(456).then(function(comment) {
  var msg = 'Loaded: ' + comment.getSubject();
  console.log(msg);
});
```

## Save a Comment

### Save a New Comment

```
var comment = new jDrupal.Comment({
  uid: [ { target_id: 1 } ],
  entity_id: [ { target_id: 123 } ],
  entity_type: [ { value: 'node' } ],
  comment_type:[ { target_id: "comment" } ],
  subject: [ { value: 'Hello World' } ],
  comment_body: [{
    "value": "<p>How are you?</p>",
    "format": "basic_html"
  }]
});
comment.save().then(function() {
  var msg = 'Saved new comment # ' + comment.id();
  console.log(msg);
});
```

## Update an Existing Comment

```
// First, load the comment...
jDrupal.commentLoad(456).then(function(comment) {

  // then change its subject...
  comment.setSubject('Goodbye world');

  // and then save the changes.
  comment.save().then(function() {
    var msg = 'Saved ' + comment.setSubject();
    console.log(msg);
  });

});
```

## Delete a Comment

```
// First, load the comment...
jDrupal.commentLoad(456).then(function(comment) {

  // then delete it.
  comment.delete(456).then(function() {
    console.log('comment deleted!');
  });

});
```
