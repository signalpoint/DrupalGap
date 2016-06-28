/**
 * Implements hook_menu().
 * @return {Object}
 */
function contact_menu() {
  try {
    var items = {};
    items['contact'] = {
      title: t('Contact'),
      page_callback: 'drupalgap_get_form',
      page_arguments: ['contact_site_form'],
      pageshow: 'contact_site_form_pageshow',
      access_arguments: ['access site-wide contact form']
    };
    items['user/%/contact'] = {
      title: t('User contact'),
      page_callback: 'drupalgap_get_form',
      page_arguments: ['contact_personal_form', 1],
      pageshow: 'contact_personal_form_pageshow',
      access_arguments: ['access user contact forms'],
      weight: 10,
      type: 'MENU_LOCAL_TASK'
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
 * The contact personal service resource.
 * @param {Object} options
 */
function contact_personal(options) {
  try {
    options.method = 'POST';
    options.path = 'contact/personal.json';
    options.service = 'contact';
    options.resource = 'personal';
    Drupal.services.call(options);
  }
  catch (error) { console.log('contact_personal - ' + error); }
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
      title: t('Your name'),
      type: 'textfield',
      required: true
    };
    form.elements.mail = {
      title: t('Your e-mail address'),
      type: 'email',
      required: true
    };
    form.elements.subject = {
      title: t('Subject'),
      type: 'textfield',
      required: true
    };
    form.elements.cid = {
      title: t('Category'),
      type: 'select',
      required: true
    };
    form.elements.message = {
      title: t('Message'),
      type: 'textarea',
      required: true
    };
    form.elements.copy = {
      title: t('Send yourself a copy?'),
      type: 'checkbox',
      default_value: 0,
      access: false
    };
    form.elements.submit = {
      type: 'submit',
      value: t('Send message')
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
          var select = $('#edit-contact-site-form-cid');
          if (!results || !results.length) { return; }
          for (var index in results) {
              if (!results.hasOwnProperty(index)) { continue; }
              var result = results[index];
              var selected = result.selected == 1 ? 'selected' : '';
              var option = '<option value="' + result.cid + '" ' + selected + '>' + result.category + '</option>';
              $(select).append(option);
          }
          $(select).selectmenu('refresh');
          if (results.length == 1) { $(select).hide(); }
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
    cid: form_state.values['cid'],
    message: form_state.values['message'],
    copy: form_state.values['copy']
  };
  contact_site({
      data: JSON.stringify(data),
      success: function(result) {
        if (result[0]) {
          drupalgap_alert(t('Your message has been sent!'));
        }
        else {
          drupalgap_alert(
            t('There was a problem sending your message!'),
            { title: t('Error') }
          );
        }
        drupalgap_form_clear();
      },
      error: function(xhr, status, message) {
        if (message) {
          message = JSON.parse(message);
          if (message.form_errors) {
            var errors = '';
            for (var element in message.form_errors) {
                if (!message.form_errors.hasOwnProperty(element)) { continue; }
                var error = message.form_errors[element];
                errors += error + '\n';
            }
            if (errors != '') { drupalgap_alert(errors); }
          }
        }
      }
  });
}

/**
 * The personal contact form.
 * @param {Object} form
 * @param {Object} form_state
 * @param {Number} recipient
 * @return {Object}
 */
function contact_personal_form(form, form_state, recipient) {
  try {
    // @TODO - when providing a personal contact form, make sure the user has
    // their personal contact form enabled.
    form.elements.name = {
      title: t('Your name'),
      type: 'textfield',
      required: true
    };
    form.elements.mail = {
      title: t('Your e-mail address'),
      type: 'email',
      required: true
    };
    form.elements.to = {
      type: 'hidden',
      required: true
    };
    var container_id = contact_personal_form_to_container_id(recipient);
    form.elements.to_display = {
      title: 'To',
      markup: '<div id="' + container_id + '"></div>'
    };
    form.elements.subject = {
      title: t('Subject'),
      type: 'textfield',
      required: true
    };
    form.elements.message = {
      title: t('Message'),
      type: 'textarea',
      required: true
    };
    form.elements.copy = {
      title: t('Send yourself a copy?'),
      type: 'checkbox',
      default_value: 0,
      access: false
    };
    form.elements.submit = {
      type: 'submit',
      value: t('Send message')
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
  catch (error) { console.log('contact_personal_form - ' + error); }
}

/**
 * The pageshow callback for the personal contact form.
 * @param {Object} form
 * @param {Number} recipient
 */
function contact_personal_form_pageshow(form, recipient) {
  try {
    user_load(recipient, {
        success: function(account) {
          // Make sure the user has their contact form enabled.
          if (!account.data.contact) {
            $('#' + drupalgap_get_page_id() + ' #drupalgap_form_errors').html(
              "<div class='messages warning'>" +
                t("Sorry, this user's contact form is disabled.") +
              '</div>'
            );
            return;
          }
          // Populate hidden value for the 'to' field.
          var container_id = contact_personal_form_to_container_id(recipient);
          $('#' + container_id).html(l(account.name, 'user/' + account.uid));
          var hidden_selector = '#' + drupalgap_get_page_id() +
            ' #edit-contact-personal-form-to';
          $(hidden_selector).val(account.name);
        }
    });
  }
  catch (error) { console.log('contact_personal_form_pageshow - ' + error); }
}

/**
 * The personal contact form submit handler.
 * @param {Ojbect} form
 * @param {Ojbect} form_state
 */
function contact_personal_form_submit(form, form_state) {
  var data = {
    name: form_state.values['name'],
    mail: form_state.values['mail'],
    to: form_state.values['to'],
    subject: form_state.values['subject'],
    message: form_state.values['message'],
    copy: form_state.values['copy']
  };
  contact_personal({
      data: JSON.stringify(data),
      success: function(result) {
        if (result[0]) { drupalgap_alert(t('Your message has been sent!')); }
        else {
          drupalgap_alert(
            t('There was a problem sending your message!'),
            { title: t('Error') }
          );
        }
        drupalgap_form_clear();
      },
      error: function(xhr, status, message) {
        if (message) {
          message = JSON.parse(message);
          if (message.form_errors) {
            var errors = '';
            for (var element in message.form_errors) {
                if (!message.form_errors.hasOwnProperty(element)) { continue; }
                var error = message.form_errors[element];
                errors += error + '\n';
            }
            if (errors != '') { drupalgap_alert(errors); }
          }
        }
      }
  });
}

/**
 * Returns the div container id to use on the "to" markup on the personal
 * contact form.
 * @param {Number} recipient
 * @return {String}
 */
function contact_personal_form_to_container_id(recipient) {
    return 'contact_personal_form_user_' + recipient;
}

