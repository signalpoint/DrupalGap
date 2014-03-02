/**
 * Implements hook_menu().
 * @return {Object}
 */
function contact_menu() {
  try {
    var items = {};
    items['contact'] = {
      title: 'Contact',
      page_callback: 'drupalgap_get_form',
      page_arguments: ['contact_site_form'],
      pageshow: 'contact_site_form_pageshow',
      access_arguments: ['access site-wide contact form']
    };
    return items;
  }
  catch (error) { console.log('contact_menu - ' + error); }
}

/**
 * The contact index service resource.
 * @param {Object} options
 */
function contact_index(options) {
  try {
    options.method = 'GET';
    options.path = 'contact.json';
    options.service = 'contact';
    options.resource = 'index';
    Drupal.services.call(options);
  }
  catch (error) { console.log('contact_index - ' + error); }
}

/**
 * The contact site service resource.
 * @param {Object} options
 */
function contact_site(options) {
  try {
    options.method = 'POST';
    options.path = 'contact/site.json';
    options.service = 'contact';
    options.resource = 'site';
    Drupal.services.call(options);
  }
  catch (error) { console.log('contact_site - ' + error); }
}

/**
 * The site contact form.
 * @param {Object} form
 * @param {Object} form_state
 * @return {Object}
 */
function contact_site_form(form, form_state) {
  try {
    form.elements.name = {
      title: 'Your name',
      type: 'textfield',
      required: true
    };
    form.elements.mail = {
      title: 'Your e-mail address',
      type: 'email',
      required: true
    };
    form.elements.subject = {
      title: 'Subject',
      type: 'textfield',
      required: true
    };
    form.elements.category = {
      title: 'Category',
      type: 'select',
      required: true
    };
    form.elements.message = {
      title: 'Message',
      type: 'textarea',
      required: true
    };
    form.elements.copy = {
      title: 'Send yourself a copy?',
      type: 'checkbox',
      default_value: 0,
      access: false
    };
    form.elements.submit = {
      type: 'submit',
      value: 'Send message'
    };
    // If the user is logged in, set the default values.
    if (Drupal.user.uid != 0) {
      form.elements.name.default_value = Drupal.user.name;
      form.elements.name.disabled = true;
      form.elements.mail.default_value = Drupal.user.mail;
      form.elements.mail.disabled = true;
      form.elements.copy.access = true;
    }
    return form;
  }
  catch (error) { console.log('contact_site_form - ' + error); }
}

/**
 * The pageshow callback for the contact site form.
 */
function contact_site_form_pageshow() {
  try {
    contact_index({
        success: function(results) {
          if (!results || !results.length) { return; }
          $.each(results, function(index, result) {
              var selected = result.selected == 1 ? 'selected' : '';
              var option =
                '<option value="' + result.cid + '" ' + selected + '>' +
                  result.category +
                '</option>';
              $('#edit-contact-site-form-category').append(option);
          });
          $('#edit-contact-site-form-category').selectmenu('refresh');
          if (results.length == 1) {
            $('#contact_site_form .field-name-category').hide();
          }
        }
    });
  }
  catch (error) { console.log('contact_site_form_pageshow - ' + error); }
}

/**
 * The site wide contact form submit handler.
 * @param {Ojbect} form
 * @param {Ojbect} form_state
 */
function contact_site_form_submit(form, form_state) {
  var data = {
    name: form_state.values['name'],
    mail: form_state.values['mail'],
    subject: form_state.values['subject'],
    category: form_state.values['category'],
    message: form_state.values['message'],
    copy: form_state.values['copy']
  };
  contact_site({
      data: JSON.stringify(data),
      success: function(result) {
        if (result[0]) {
          drupalgap_alert('Your message has been sent!');
        }
        else {
          drupalgap_alert(
            'There was a problem sending your message!',
            { title: 'Error' }
          );
        }
        drupalgap_form_clear();
      }
  });
}

//contact_personal_form

// @TODO - when providing a personal contact form, make sure the user has their
// personal contact form enabled.

