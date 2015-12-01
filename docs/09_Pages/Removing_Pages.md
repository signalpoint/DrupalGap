By default, as we navigate around our app, the pages we visit stay in the [DOM](http://en.wikipedia.org/wiki/Document_Object_Model). This allows the page to quickly respond next time the user visits the page. However, there are times when we wish to have the page be reloaded the next time it is visited. This can easily be accomplished with the various techniques for [Reloading Pages](Reloading_Pages).

Other times, we may want to delete a page from the app's DOM, this can be accomplished using the `drupalgap_remove_page_from_dom` function:

```
var page_id = drupalgap_get_page_id('my_page_path');
drupalgap_remove_page_from_dom(page_id);
```

This code will remove the page from the DOM, unless the page being removed is the current page. By default, DrupalGap will not remove the current page from the DOM. Strange behavior can and will most likely occur if we were to remove the current page. However, just in case the current page absolutely needs to be removed, the force option may be used:

`drupalgap_remove_page_from_dom(page_id, { force: true });`

Proceed with caution when forcing the removal of the current page.

## Removing All Pages from the DOM

Sometimes we just want to clean house, and remove all the pages from the DOM. We can do that with this function:

`drupalgap_remove_pages_from_dom();`

This will remove all of the pages from the DOM, except for the current one.