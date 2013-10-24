drupalgap.api = {
'options':{ /* these are set by drupalgap_api_default_options() */ },
  'call':function(options){
    try {
      // Get the default api options, then adjust to the caller's options if they are present.
      var api_options = drupalgap_api_default_options();

      // Now assemble the callbacks together.
      var call_options = drupalgap_chain_callbacks(api_options, options);

      // TODO - this is a good spot for a hook, e.g. hook_drupalgap_api_preprocess

      // Build the Drupal URL path to call if one hasn't been assembled already
      // by the caller. Save a copy of the service resource url for
      // hook_services_success() before it gets modified below.
      call_options.service_resource = '' + options.path;
      if (!call_options.url || call_options.url == '') {
        call_options.url = call_options.site_path + drupalgap.settings.base_path;
        if (!drupalgap.settings.clean_urls) {
          call_options.url += '?q=';
        }
        if (call_options.endpoint) {
          call_options.url += call_options.endpoint + '/';
        }
        call_options.url += options.path;
      }

      // Make sure the device is online, if it isn't send the
      // user to the offline page.
      drupalgap_check_connection();
      if (!drupalgap.online) {
        navigator.notification.alert(
          'No network connection!',
          function(){ drupalgap_goto('offline'); },
          'Offline',
          'OK'
        );
        return false;
      }
      
      if (drupalgap.settings.debug) { dpm(call_options.url); }
      
      // Get CSRF token.
      _drupalgap_api_get_csrf_token(call_options, {
          success:function() {
            
            drupalgap_loading_message_show();
            
            // Build api call object options.
            var api_object = {
              url: call_options.url,
              type: call_options.type,
              data: call_options.data,
              dataType: call_options.dataType,
              async: true,
              error: call_options.error,
              success: call_options.success,
              service_resource:call_options.service_resource
            }
            
            // Synchronous call?
            if (!call_options.async) {
              api_object.async = false;
            }
            
            // If there are any beforeSend declarations, attach them to the api
            // call object.
            if (call_options.beforeSend) {
              api_object.beforeSend = call_options.beforeSend;
            }
            
            if (drupalgap.settings.debug) { dpm(api_object); }
            
            // Make the call.
            $.ajax(api_object);      
          }
      });
    }
    catch (error) {
      navigator.notification.alert(
        error,
        function(){},
        'DrupalGap API Error',
        'OK'
      );
    }
  }
};

/**
 * Given the API's call options and a JSON object containing a success and error
 * callback, this will append a CSRF token to the API call's request header, if
 * necessary.
 */
function _drupalgap_api_get_csrf_token(call_options, options) {
  try {
    var token = false;
    // Do we potentially need a token for this call? We most likely need one if
    // the call option's type is not one of these types.
    var types = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
    if ($.inArray(call_options.type.toUpperCase(), types) == -1) {
      // Anonymous users don't need the CSRF token, unless we're calling system
      // connect, then we need to pass along the token if we have one.
      if (drupalgap.user.uid == 0 &&
          call_options.service_resource != 'drupalgap_system/connect.json' &&
          call_options.service_resource != 'system/connect.json') {
        options.success.call();
        return;
      }
      // Is there a token available in local storage?
      token = window.localStorage.getItem('sessid');
      // If we don't already have a token, is there one in drupalgap.sessid?
      if (!token && drupalgap.sessid) {
        token = drupalgap.sessid;
      }
      if (!token) {
        // We don't have a previous token to use, let's grab one from Drupal.
        var token_url = drupalgap.settings.site_path +
                        drupalgap.settings.base_path +
                        '?q=services/session/token';
        drupalgap_loading_message_show();
        $.ajax({
            url:token_url,
            type:'get',
            dataType:'text',
            success:function(token){
              drupalgap_loading_message_hide();
              // Save the token to local storage as sessid, set drupalgap.sessid
              // with the token, attach the token and the request header to the
              // call options, then return via the success function.
              window.localStorage.setItem('sessid', token);
              drupalgap.sessid = token;
              call_options.token = token;
              call_options.beforeSend = function (request) {
                request.setRequestHeader("X-CSRF-Token", call_options.token);
              };
              options.success.call();
            },
            error:function (jqXHR, textStatus, errorThrown) {
              drupalgap_loading_message_hide();
              alert('Failed to retrieve CSRF token! (' + errorThrown +
                    ') You must upgrade your Drupal Services module to version 3.5 (or above)! ' +
                    'Also check your device for a connection, and try logging out and then back in!');
            }
        });
      }
      else {
        // We had a previous token available, let's use it by attaching it
        // to the call options and the CSRF header.
        call_options.token = token;
        call_options.beforeSend = function (request) {
          request.setRequestHeader("X-CSRF-Token", call_options.token);
        };
        options.success.call();
      }
    }
    else {
      // This call's HTTP method doesn't need a token, so we return via the
      // success function.
      options.success.call();
    }
  }
  catch (error) {
    alert('_drupalgap_api_get_csrf_token - ' + error);
  }
}

function drupalgap_api_default_options() {
  var default_options = {};
  default_options = {
    'url':'',
    'type':'get',
    'async':true,
    'data':'',
    'dataType':'json',
    'endpoint':drupalgap.settings.default_services_endpoint,
    'site_path':drupalgap.settings.site_path,
    'success':function(result){
      drupalgap_loading_message_hide();
      // Invoke hook_services_success().
      module_invoke_all('services_success', this.service_resource, result);
      // If debugging is turned on, print the result to the console.
      if (drupalgap.settings.debug) {
        // Note: http://stackoverflow.com/a/11616993/763010
        var cache = [];
        console.log(JSON.stringify(result, function(key, value) {
            if (typeof value === 'object' && value !== null) {
              if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
              }
              // Store value in our collection
              cache.push(value);
            }
            return value;
        }));
        cache = null; // Enable garbage collection
      }
    },
    'error':function(jqXHR, textStatus, errorThrown){
      // TODO - this is a good spot for a hook
      // e.g. hook_drupalgap_api_postprocess
      drupalgap_loading_message_hide();
      console.log(JSON.stringify({
        "jqXHR":jqXHR,
        "textStatus":textStatus,
        "errorThrown":errorThrown,
      }));
      extra_msg = '';
      if (jqXHR.statusText && jqXHR.statusText != errorThrown) {
        extra_msg = '[' + jqXHR.statusText + ']';
      }
      else if (jqXHR.responseText && jqXHR.responseText != errorThrown) {
        extra_msg = jqXHR.responseText;
      }
      //if (this.error_alert) {
        navigator.notification.alert(
          textStatus + ' (' + errorThrown + ') ' + extra_msg,
          function(){},
          'DrupalGap API Call Error',
          'OK'
        );
      //}
    },
    'error_alert':true, /* an option to supress the default error call back's
                           alert dialog window, use: options.error_alert = false;
                           use with caution */
    'service_resource':null, /* holds a copy of the service resource being
                                called e.g. user/login.json,
                                system/connect.json */
  };
  return default_options;
}

/**
 * When the app is first loading up, DrupalGap checks to see if the device has
 * a connection, if it does then this hook is called. Implementations of this
 * hook need to return true if they'd like DrupalGap to continue, or return
 * false if you'd like DrupalGap to NOT continue. If DrupalGap continues, it
 * will perform a System Connect resource call then go to the App's front page.
 * This is called during DrupalGap's "deviceready" implementation for PhoneGap.
 */
function hook_deviceready() {}

/**
 * Called after a successful services API call to a Drupal site. Do not call
 * any services from within your implementation, you may run into an infinite
 * loop in your code. See http://drupalgap.org/project/force_authentication for
 * example usage.
 */
function hook_services_success(url, data) { }

/**
 * A hook used to declare custom block information.
 */
function hook_block_info() {}

/**
 * A hook used to render custom blocks.
 */
function hook_block_view() {}

/**
 *
 */
function hook_404(router_path) {}

/**
 * Called after drupalgap_entity_render_content() assembles the entity.content
 * string. Use this to make modifications to the HTML output of the entity's
 * content before it is displayed.
 */
function hook_entity_post_render_content(entity) { }

/**
 * Used by modules to provide field widgets for form element items. 
 */
function hook_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) { }

/**
 * Called after a form element is assembled. Use it to alter a form element.
 */
//function hook_form_element_alter(form, element, variables) { }

/**
 * Called after drupalgap_entity_render_field() assembles the field content
 * string. Use this to make modifications to the HTML output of the entity's
 * field before it is displayed. The field content will be inside of
 * reference.content, so to make modifications, change reference.content. For
 * more info: http://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language
 */
function hook_entity_post_render_field(entity, field_name, field, reference) {}

/**
 * This hook is used to make alterations to existing forms.
 */
function hook_form_alter(form, form_state, form_id) {}

/**
 * Called after drupalgap_image_path() assembles the image path. Use this hook
 * to make modifications to the image path. Return the modified path, or false
 * to allow the default path to be generated.
 */
function hook_image_path_alter(src) { }

/**
 * This hook is used by modules that need to execute custom code when the module
 * is loaded.
 */
function hook_install() {}

/**
 * This hook is used to declare menu paths for custom pages.
 */
function hook_menu() {}

function hook_mvc_model() {
  var models = {};
  return models;
}
function hook_mvc_view() {}
function hook_mvc_controller() {}

// TODO - list all other core hooks here.

