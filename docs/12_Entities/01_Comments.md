See the [Comment Services](../Services/Comment_Services) page for more information.

## comment_load()

```
comment_load(456, {
    success: function(comment) {
      console.log('Loaded comment #' + comment.cid);
    }
});
```

## comment_save()

**Save a New Comment**

```
var comment = {
  nid: 123,
  subject: 'My Comment Subject',
  comment_body: {
    und: [
      { value: 'My Comment Body.' }
    ]
  }
};
comment_save(comment, {
    success:function(result) {
      console.log('Saved comment #' + result.cid);
    }
});
```

**Update an Existing Comment**

```
var comment = {
  cid: 456,
  subject: "New Subject",
  comment_body: {
    und: [
      { value: "New Comment Body" }
    ]
  }
};
comment_save(comment, {
  success: function(result) {
    alert("Saved comment #" + result[0]);
  }
});
```

## comment_delete()

```
comment_delete(456, {
    success: function(result){
      if (result[0]) {
        alert("Comment deleted!");
      }
    }
});
```

## comment_index()

**Get Comments from a Node**

```
var query = {
  parameters:{
    nid: 123,
  }
};
comment_index(query, {
    success: function(comments){
      alert('Found ' + comments.length + ' comment(s)!');
    }
});
```