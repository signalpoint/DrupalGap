See the [Nodes](../Entities/Nodes) page for more information.

## Create

**Example Result**

```
{
  "nid": "1",
  "uri": "http://www.example.com/drupalgap/node/1"
}
```

## Retrieve

- the "View published content" permission must be enabled for this to work
- unpublished nodes cannot be retrieved unless the user has the "Administer content" permission
- if a user has the "View own unpublished content" pemission they can retrieve their own unpublished node

**Example Result**

```
{
  "vid":"456",
  "uid":"1",
  "title":"Hello WOrld",
  "log":"",
  "status":"1",
  "comment":"1",
  "promote":"0",
  "sticky":"0",
  "nid":"123",
  "type":"page",
  "language":"und",
  "created":"1354839115",
  "changed":"1354841890",
  "tnid":"0",
  "translate":"0",
  "revision_timestamp":"1354841890",
  "revision_uid":"1",
  "body":{
    "und":[
      {
        "value":"Goodbye robots.",
        "summary":"",
        "format":"filtered_html",
        "safe_value":"<p>Goodbye robots.</p>\n",
        "safe_summary":""
      }
    ]
  },
  /* ... */
  "cid":"0",
  "last_comment_timestamp":"1354839115",
  "last_comment_name":null,
  "last_comment_uid":"1",
  "comment_count":"0",
  "name":"bob",
  "picture":"0",
  "data":"b:0;",
  "path":"http://www.example.com/?q=node/123"
}
```

## Update

**Example Result**

```
{
  "nid": "123",
  "uri": "http://www.example.com/drupalgap/node/123"
}
```

## Delete

**Example Result**

`[true]`

