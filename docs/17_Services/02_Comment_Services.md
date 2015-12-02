See the [Comments](../Entities/Comments) page for more information.

## Create

**Example Result**

```
{
  'cid:'456',
  'uri':'http://www.example.com/drupalgap/?q=drupalgap/comment/456'
}
```

## Retrieve

**Example Result**

```
{
    "cid": "123",
    "pid": "0",
    "nid": "4",
    "uid": "1",
    "subject": "Hey",
    "hostname": "173.14.56.66",
    "created": "1358477124",
    "changed": "1358477124",
    "status": "1",
    "thread": "01/",
    "name": "bob",
    "mail": "",
    "homepage": "",
    "language": "und",
    "node_type": "comment_node_article",
    "registered_name": "bob",
    "u_uid": "1",
    "signature": "",
    "signature_format": "filtered_html",
    "picture": "0",
    "new": 1,
    "comment_body": {
        "und": [
            {
                "value": "You!",
                "format": "filtered_html",
                "safe_value": "<p>You!</p>\n"
            }
        ]
    },
    /* ... */
}
```

## Update

**Example Result**

`["1"]`

## Delete

**Example Result**

`[true]`