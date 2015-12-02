See the [Taxonomy Vocabulary Services](../Services/Taxonomy_Vocabulary_Services) page for more information.

## taxonomy_vocabulary_load()

```
taxonomy_vocabulary_load(1, {
    success:function(taxonomy_vocabulary) {
      console.log('Loaded: ' + taxonomy_vocabulary.name);
    }
});
```

## taxonomy_vocabulary_save()

**Save a New Vocabulary**

```
var taxonomy_vocabulary = {
  name: "Fruits",
  machine_name: "fruits",
  description: "Fruit is delicious."
};
taxonomy_vocabulary_save(taxonomy_vocabulary, {
    success: function(result){
      if (result[0] === 1) {
        alert("Created new taxonomy vocabulary");
      }
    }
});
```

**Update an Existing Vocabulary**

```
var taxonomy_vocabulary = {
  vid: 2,
  name: "Colorful Fruits",
  machine_name: "fruits",
  description: user_password()
};
taxonomy_vocabulary_save(taxonomy_vocabulary, {
    success: function(result){
      if (result[0] == 2) {
        alert("Updated taxonomy vocabulary");
      }
    }
});
```

## taxonomy_vocabulary_delete()

```
var vid = 2;
taxonomy_vocabulary_delete(vid, {
    success: function(result){
      if (result[0] == 3) {
        alert("Deleted taxonomy vocabulary!");
      }
    }
});
```

## taxonomy_vocabulary_index()

**Load all Vocabularies (default limits to 20 results)**

```
taxonomy_vocabulary_index(null, {
    success:function(vocabularies){
      alert("Indexed " + vocabularies.length + " vocabularies!");
    }
});
```

**Get ID of Vocabulary with the Name "Tags"**

```
var query = {
  fields:['vid'],
  parameters:{
    'name':'Tags'
  }
};
taxonomy_vocabulary_index(query, {
    success:function(vocabularies){
      if (vocabularies.length == 0) { return; }
      var vocabulary = vocabularies[0];
      alert('Loaded vocabulary #' + vocabulary.vid);
    }
});
```