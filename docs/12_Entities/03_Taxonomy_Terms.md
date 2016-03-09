See the [Taxonomy Term Services](../Services/Taxonomy_Term_Services) page for more information.

## taxonomy_term_load()

```
taxonomy_term_load(1, {
    success:function(taxonomy_term) {
      console.log('Loaded term: ' + taxonomy_term.name);
    }
});
```

## taxonomy_term_save()

**Save a New Term**

...

**Update an Existing Term**

...

## taxonomy_term_index()

**Get Terms from a Given Vocabulary ID**

```
var query = {
  parameters: {
    vid: 1
  }
};
taxonomy_term_index(query, {
    success: function(terms) {
      if (terms.length == 0) { return; }
      alert('Loaded ' + terms.length + ' term(s)!');
    }
});
```