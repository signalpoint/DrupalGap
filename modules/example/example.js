/**
 * Implements hook_menu().
 */
function example_menu() {
  try {
    if (drupalgap.settings.debug) {
      console.log('example_menu()');
      console.log(JSON.stringify(arguments));
    }
    var items = {
      'example':{
        'title':'Example Page',
        'page_callback':'example_page',
      },
    };
    return items;
  }
  catch (error) {
    alert('example_menu - ' + error);
  }
}

/**
 * Page callback for example page.
 */
function example_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('example_page()');
      console.log(JSON.stringify(arguments));
    }
    // Add a button to the page that links to drupalgap.org
    return {
      'drupalgap':{
        'theme':'button_link',
        'path':'http://www.drupalgap.org',
        'text':'www.drupalgap.org'
      }
    };
  }
  catch (error) {
    alert('example_page - ' + error);
  }
}


/**
 * Implements hook_form_alter().
 */
function example_form_alter(form, form_state, form_id) {
  if (form_id == 'user_login') {
    form.elements.name.title = 'Your Login Name';
  }
}

function custom_stuff_form() {
  try {
  }
  catch (error) {
    alert('custom_stuff_form - ' + error);
  }
}

function custom_stuff_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('custom_stuff_validate - ' + error);
  }
}

function custom_stuff_submit(form, form_state) {
  try {
  }
  catch (error) {
    alert('custom_stuff_submit - ' + error);
  }
}

