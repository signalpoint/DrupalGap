

See the [Taxonomy Vocabularies](../Entities/Taxonomy_Vocabularies) page for more information.

## Create

**Example Result**

[1]

1 = [SAVED_NEW](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_NEW/7)

Other Example Results

`[2]`

2 = [SAVED_UPDATED](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_UPDATED/7)

See [taxonomy_vocabulary_save()](http://api.drupal.org/api/drupal/modules%21taxonomy%21taxonomy.module/function/taxonomy_vocabulary_save/7) for information about return values.

## Retrieve

**Example Result**

```
{
  "vid":"1",
  "name":"Tags",
  "machine_name":"tags",
  "description":"Use tags to group articles on similar topics into categories.",
  "hierarchy":"0",
  "module":"taxonomy",
  "weight":"0",
  /* ... */
}
```

## Update

**Example Result**

`[2]`

2 = [SAVED_UPDATED](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_UPDATED/7)

See [taxonomy_vocabulary_save()](http://api.drupal.org/api/drupal/modules%21taxonomy%21taxonomy.module/function/taxonomy_vocabulary_save/7) for information about return values.

## Delete

**Example Result**

`[3]`

See [taxonomy_vocabulary_delete](http://api.drupal.org/api/drupal/modules%21taxonomy%21taxonomy.module/function/taxonomy_vocabulary_delete/7) and [SAVED_DELETED](http://api.drupal.org/api/drupal/includes%21common.inc/constant/SAVED_DELETED/7) for more information.

## getTree

**Example Result**

```
[
  {
    "tid":"2",
    "vid":"1",
    "name":"goodbye world",
    "description":"",
    "format":"filtered_html",
    "weight":"0",
    "depth":0,
    "parents":["0"]
  },
  {
    "tid":"1",
    "vid":"1",
    "name":"hello world",
    "description":"",
    "format":"filtered_html",
    "weight":"0",
    "depth":0,
    "parents":["0"]
  }
]
```