# Alter existing page

```
/**
 * Implements hook_init().
 */
function example_init() {

  // Take over the Foo module's Bar page.
  var barPage = dg.router.loadRoute('foo.bar');
  barPage.defaults._controller = example.pageBar;
  dg.router.saveRoute(barPage);

}

example.pageBar = function() {
  var element;
  element.hello = {
    _markup: '<p>' + dg.t('Hello world') + '</p>'
  };
  return element;
};
```
