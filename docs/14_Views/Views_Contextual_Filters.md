In hindsight it was a cool idea to try and support [Views Exposed Filters](Views_Exposed_Filters) automatically in DrupalGap, but we've come to the realization that each app should be unique, and trying to "auto render" exposed filters just isn't worth the effort.

Never fear, there is an alternate technique that can be used with a [custom DrupalGap module](../Modules/Create_a_Custom_Module) and provides much more flexibility to the developer.

With the combination of a [Custom Page](../Pages/Creating_a_Custom_Page), and a [Views Render Array](../Widgets/Views_Widget) (used within a `pageshow` event), we can build a page with filters that auto refresh the Views results.
 
Here's the general plan:

1. Create a custom page with 2 widgets, one for our filters, and one for an empty div
2. Attach a `pageshow` to render and inject a Views Render Array into the empty div
3. Add a listener to react to filter changes, and re-run the `pageshow` handler

Here's an example that utilizes a `List (text)` field on a content type as a contextual filter to a Views JSON page display:

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['my-page'] = {
      title: 'My page',
      page_callback: 'my_module_page',
      pageshow: 'my_module_pageshow'
    };
  return items;
}

function my_module_container_id() {
  return 'my-module-container';
}

function my_module_page() {
  var content = {};
  content.filter = {
    theme: 'my_filter'
  };
  var id = my_module_container_id();
  content.container = {
    markup: '<div id="' + id + '"></div>'
  };
  return content;
}

function my_module_pageshow() {
  var content = {};
  
  // Build a path to the View with a contextual filter.
  var viewsPath = 'my-view.json/' +
    ngt_invitation_status_value();
  
  // Build a Views Render Array with contextual filter.
  content.results = {
    theme: 'view',
    path: viewsPath,
    format: 'ul',
    row_callback: 'my_module_row',
    empty_callback: 'my_module_empty'
  }
  
  // Inject the rendered content into our div.
  $('#' + my_module_container_id()).html(
    drupalgap_render(content)
  ).trigger('create');
}

function my_module_row(view, row, variables) {
  return l(row.title, 'node/' + row.nid);
}

function my_module_empty(view) {
  return t('No content found.');
}

function theme_my_filter(variables) {
  return theme('select', {
    options: {
      pending: t('Pending'),
      accepted: t('Accepted'),
      declined: t('Declined'),
      expired: t('Expired'),
      withdrawn: t('Withdrawn')
    },
    attributes: {
      onchange: 'my_filter_onchange(this)',
      class: 'my-filter',
      'data-theme': 'b'
    }
  });
}

function my_filter_value() {
  return $('#' + drupalgap_get_page_id() + ' select.my-filter').val();
}

function my_filter_onchange(select) {
  //console.log($(select).val());
  my_module_pageshow();
}
```
