## Get RSS Feed

```
drupalgap.services.rss.retrieve.call({
    'url':'http://www.tylerfrankenstein.com/code/rss.xml',
    'success':function(data){
      var rss_items = drupalgap_services_rss_extract_items(data);
      $.each(rss_items, function(index, item){
          $('div#my_feed_items').append('<p>' + item.title + '</p>');
      });
    },
});
```