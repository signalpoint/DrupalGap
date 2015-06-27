angular.module('dgUser', ['drupalgap'])

// hook_menu()
.config(['$routeProvider', function($routeProvider) {
      //dpm('dgUser - routeProvider');
      $routeProvider.when('/user/login', {
          templateUrl: 'themes/spi/page.tpl.html',
          //template: drupalgap_get_form('user_login_form'),
          //template: '<form user-login-form></form>',
          controller: 'dg_page_controller',
          page_callback: 'drupalgap_get_form',
          page_arguments: ['user_login_form']
      });
}]);

// @TODO this should be attached to the module, not the app.
dgApp.directive("userLoginForm", function($compile) {
    return {

      controller: function($scope, drupal) {
        
        dpm('userLoginForm - controller');

        // Set up form defaults.
        var form = dg_form_defaults("user_login_form", $scope);

        // Build form elements.
        form.entity_type = 'user';
        form.bundle = null;
        form.elements.name = {
          type: 'textfield',
          title: t('Username'),
          title_placeholder: true,
          required: true
        };
        form.elements.pass = {
          type: 'password',
          title: t('Password'),
          title_placeholder: true,
          required: true,
          attributes: {
            //onkeypress: "drupalgap_form_onkeypress('" + form.id + "')"
          }
        };
        form.elements.submit = {
          type: 'submit',
          value: t('Login')
        };
        /*if (user_register_access()) {
          form.buttons['create_new_account'] = {
            title: t('Create new account'),
            attributes: {
              onclick: "drupalgap_goto('user/register')"
            }
          };
        }
        form.buttons['forgot_password'] = {
          title: t('Request new password'),
            attributes: {
              onclick: "drupalgap_goto('user/password')"
            }
        };*/

        // Form submit handler.
        form.submit.push(function(form, form_state) {
            drupal.user_login(
              form_state.values.name,
              form_state.values.pass
            ).then(function(data) {
                console.log(data);
                //drupalgap_goto(drupalgap.settings.front);
            });
        });

        // Place the form into the scope.
        $scope.form = form;

      },

      link: function(scope, element) {
        
        dpm('userLoginForm - link');

        // Add the form to the element.
        element.append(dg_ng_compile_form($compile, scope));

      }

    };
});


/**
 *
 */
function user_login_form(form) {
  try {
    console.log(arguments);
    form.elements.name = {
      type: 'textfield',
      title: t('Username'),
      title_placeholder: true,
      required: true
    };
    form.elements.pass = {
      type: 'password',
      title: t('Password'),
      title_placeholder: true,
      required: true,
      attributes: {
        onkeypress: "drupalgap_form_onkeypress('" + form.id + "')"
      }
    };
    form.elements.submit = {
      type: 'submit',
      value: t('Login')
    };
    return form;
  }
  catch (error) { console.log('user_login_form - ' + error); }
}

/**
 *
 */
function dg_user_default() {
  try {
    return {
      "uid": 0,
      "hostname": null,
      "roles": {
          "1": "anonymous user"
      },
      "cache": 0,
      "timestamp": Date.now() / 1000 | 0
    };
  }
  catch (error) { console.log('dg_user_default - ' + error); }
}

/**
 *
 */
function dg_user_get() {
  try {
    return drupalgap.user;
  }
  catch (error) { console.log('dg_user_get - ' + error); }
}

/**
 *
 */
function dg_user_set(user) {
  try {
    drupalgap.user = user;
  }
  catch (error) { console.log('dg_user_set - ' + error); }
}

