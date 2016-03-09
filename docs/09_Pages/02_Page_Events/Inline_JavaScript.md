## Inline Page Event Handlers

Often times, we'll want to place inline page event handlers into our app to dynamically fetch some data from the Drupal server. However, since we typically have multiple pages in the DOM at a time, jQueryMobile may "accidentally" fire our inline event handlers multiple times. To get around this, DrupalGap provides a wrapper function to prevent the handlers from firing multiple times. Here's an example to handle a pageshow event using inline JS in our HTML:

```
var html = '<p id="my_paragraph">Loading...</p>';
html += drupalgap_jqm_page_event_script_code({
    page_id: drupalgap_get_page_id(),
    jqm_page_event: 'pageshow',
    jqm_page_event_callback: 'my_paragraph_pageshow',
    jqm_page_event_args: JSON.stringify({
        hello: 'Hi!'
    })
});
return html;
```

Now if we had a function declared in our JS to handle this, the function would be called during the pageshow event of the current page:

```
function my_paragraph_pageshow(options) {
  $('#my_paragraph').html(options.hello).trigger('create');
}
```

## Firing the Same Inline Event Multiple Times

By default, DrupalGap only lets an inline event handler fire once. To force it to fire multiple times, you can pass in an optional string as the second argument to [drupalgap_jqm_page_event_script_code()](http://api.drupalgap.org/global.html#drupalgap_jqm_page_event_script_code), for example:

```
for (var i = 0; i < 2; i++) {
  html += drupalgap_jqm_page_event_script_code(
    { /* ... see example object above ... */ },
    '' + i
  );
}
```

The optional string must be unique for each iteration.
