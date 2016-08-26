Although DrupalGap can [edit most entities](../Pages/Built_in_Pages) out of the box, and we can override the output of a node page using [hook_node_page_view_alter_TYPE()](http://api.drupalgap.org/7/global.html#hook_node_page_view_alter_TYPE), we can still make our own custom form to load and edit an entity.

For example, say we had a content type called **Team**, we could edit team nodes like this:

```
/**
 * Implements hook_menu().
 */
function example_menu() {
  var items = {};
  items['team-edit/%'] = {
    title: 'Team edit',
    page_callback: 'example_team_edit_page',
    pageshow: 'example_team_edit_pageshow',
    page_arguments: [1]
  };
  return items;
}

function example_team_edit_container_id(nid) {
  return 'example-team-edit-' + nid;
}

function example_team_edit_page(nid) {
  return '<div id="' + example_team_edit_container_id(nid) + '"></div>';
}

function example_team_edit_pageshow(nid) {
  node_load(nid, {
    success: function(node) {
      var content = {};
      content['my-form'] = {
        markup: drupalgap_get_form('example_team_edit_form', node)
      };
      $('#' + example_team_edit_container_id(nid)).html(
        drupalgap_render(content)
      ).trigger('create');
    }
  });
}

function example_team_edit_form(form, form_state, node) {

  // Node title.
  form.elements.title = {
    type: 'textfield',
    title: t('Title'),
    required: true,
    default_value: node.title
  };
  
  // Build other form elements here...
  
  // Form buttons.
  form.elements['submit'] = {
    type: 'submit',
    value: t('Save')
  };
  form.buttons['cancel'] = drupalgap_form_cancel_button();
  
  // Return the form.
  return form;
}

function example_team_edit_form_submit(form, form_state) {
  node_save(form_state.values, {
    success: function(result) {
      // Do something when the form saves...
    }
  });
}

```
