drupalgap.services.drupalgap_taxonomy = {
  'get_vocabularies':{
    'options':{
      'type':'post',
      'path':'drupalgap_taxonomy/get_vocabularies.json',
      'success':function(vocabularies){

      },
    },
    'call':function(options){
      try {
        console.log(
          'WARNING: drupalgap.services.drupalgap_taxonomy.get_vocabularies ' +
          'has been deprecated! Use taxonomy_vocabulary_index() instead.';
        );
        taxonomy_vocabulary_index(null, options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'DrupalGap Taxonomy Get Vocabularies Error',
          'OK'
        );
      }
    },
  }, // <!-- get_vocabularies -->
  'get_terms':{
    'options':{
      'type':'post',
      'path':'drupalgap_taxonomy/get_terms.json',
      'success':function(terms){

      },
    },
    'call':function(options){
      try {
        console.log(
          'WARNING: drupalgap.services.drupalgap_taxonomy.get_terms ' +
          'has been deprecated! Use taxonomy_term_index() instead.';
        );
        var query = {
          parameters: {
            vid: options.vid
          }
        };
        taxonomy_term_index(query, options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'DrupalGap Taxonomy Get Terms Error',
          'OK'
        );
      }
    },
  }, // <!-- get_terms -->
};
