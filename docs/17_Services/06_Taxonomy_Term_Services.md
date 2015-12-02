See the [Taxonomy Terms](../Entities/Taxonomy_Terms) page for more information.

## Create

**Example Result**

`[1]`

1 = [SAVED_NEW](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_NEW/7)

**Other Example Results**

`[0]`

0 = ERROR

`[2]`

2 = [SAVED_UPDATED](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_UPDATED/7)

See [taxonomy_term_save()](http://api.drupal.org/api/drupal/modules%21taxonomy%21taxonomy.module/function/taxonomy_term_save/7) for information about return values.

## Retrieve

**Example Result**

```
{
  "tid":"1",
  "vid":"1",
  "name":"hello world",
  "description":"",
  "format":"filtered_html",
  "weight":"0",
  "vocabulary_machine_name":"tags",
  /* ... */
}
```

## Update

**Example Result**

`[2]`

2 = [SAVED_UPDATED](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_UPDATED/7)

**Other Example Results**

`[0]`

0 = ERROR

`[1]`

1 = [SAVED_NEW](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_NEW/7)

See [taxonomy_term_save()](http://api.drupal.org/api/drupal/modules%21taxonomy%21taxonomy.module/function/taxonomy_term_save/7) for information about return values.

## Delete

**Example Result**

[3]

See [taxonomy_term_delete](http://api.drupal.org/api/drupal/modules%21taxonomy%21taxonomy.module/function/taxonomy_term_delete/7) and [SAVED_DELETED](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_DELETED/7) for more information.

## selectNodes

**Example Usage**

```
drupalgap.services.taxonomy_term.selectNodes.call({
  'tid':1,
  'success':function(nodes){
    alert('Selected ' + nodes.length + ' nodes!');
  }
});
```

**Example Result**

```
[
  {
    "vid":"2",
    "uid":"1",
    "title":"Hello World",
    "log":"",
    "status":"1",
    "comment":"1",
    "promote":"0",
    "sticky":"0",
    "nid":"2",
    "type":"page",
    "language":"und",
    "created":"1354839115",
    "changed":"1356907502",
    "tnid":"0",
    "translate":"0",
    "revision_timestamp":"1356907502",
    "revision_uid":"1",
    "body":{
      "und":[{
        "value":"Goodbye robots.",
        "summary":"",
        "format":"filtered_html",
        "safe_value":"<p>Goodbye robots.</p>\n",
        "safe_summary":""
      }]
    },
    "cid":"0",
    "last_comment_timestamp":"1354839115",
    "last_comment_name":null,
    "last_comment_uid":"1",
    "comment_count":"0",
    "name":"tyler",
    "picture":"0",
    "data":"b:0;",
    "uri":"http://10.0.2.2/drupalgap/?q=drupalgap/node/2"
  }
]
```