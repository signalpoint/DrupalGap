Although DrupalGap can [edit most entities](../Pages/Built_in_Pages) out of the box, and we can override the output of a node page using [hook_node_page_view_alter_TYPE()](http://api.drupalgap.org/7/global.html#hook_node_page_view_alter_TYPE), we can still make our own custom form to load and edit an entity.

For example, say we had a content type called **Team**, we could add and edit team nodes like this:

```
/**
 * Implements hook_menu().
 */
function example_menu() {
  var items = {};
  items['team/add'] = {
      page_callback: 'drupalgap_get_entity_form',
      page_arguments: ['my_module_team_form', 'node', 'add']
    };
  items['team/%/edit'] = {
    page_callback: 'drupalgap_get_entity_form',
    page_arguments: ['my_module_team_form', 'node', 1]
  };
  return items;
}

function my_module_team_form(form, form_state, node) {
  if (node.nid) {
    form.id += '_' + node.nid;
    form.elements['nid'] = {
        type: 'hidden',
        required: true,
        default_value: node.nid
      };
  }
  form.elements['type'] = {
    type: 'hidden',
    required: true,
    default_value: node.type
  };
  form.elements['title'] = {
    type: 'textfield',
    title: t('Title'),
    required: true,
    default_value: node.title
  };
  form.elements['submit'] = {
    type: 'submit',
    value: t('Save')
  };
  return form;
}

function my_module_team_form_submit(form, form_state) {
  node_save(form_state.values, {
    success: function(result) {
      drupalgap_goto('team/' + result.nid, { reloadPage: true });
    }
  });
}
```

You may optionally pass a *unique* 4th `page_argument` as a string, should you need to use this same technique on a different `hook_menu()` item. For example:

```
function example_menu() {
  var items = {};
  items['team/%/edit'] = {
    page_callback: 'drupalgap_get_entity_form',
    page_arguments: ['my_module_team_form', 'node', 1, 'team-form']
  };
  items['manage-team/%/edit'] = {
    page_callback: 'drupalgap_get_entity_form',
    page_arguments: ['my_module_manage_team_form', 'node', 1, 'manage-team-form']
  };
  return items;
}
```

For a similar example with user accounts, [see this comment](https://github.com/signalpoint/DrupalGap/issues/845#issue-173522542).

The example above is actually a new feature that was built after doing the same thing over and over again, which is the example listed below.

The example below provides complete control over the process, whereas the above example is essentially short hand for this:

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

  // Node ID.
  form.elements['nid'] = {
    type: 'hidden',
    required: true,
    default_value: node.nid
  };

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
