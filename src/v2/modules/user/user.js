angular.module('dgUser', [])
.config(function() {
    dpm('dgUser - config');
})
// $routeProvider == hook_menu()
.config(['$routeProvider', function($routeProvider) {
      dpm('dgUser - routeProvider');
      $routeProvider.when('/user/login', {
          templateUrl: 'themes/spi/page.tpl.html',
          //template: drupalgap_get_form('user_login_form'),
          //template: '<form user-login-form></form>',
          controller: function() {
            dpm('user/login controller');
          }
      });
}]);

//dgApp.directive("userLoginForm", function($compile) {
angular.module('dgUser').directive("userLoginFormDirective", function($compile) {
    return {

      controller: function($scope, drupal) {
        
        dpm('userLoginForm - controller');

        // Set up form defaults.
        /*var form = dg_form_defaults("user_login_form", $scope);

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
            onkeypress: "drupalgap_form_onkeypress('" + form.id + "')"
          }
        };
        form.elements.submit = {
          type: 'submit',
          value: t('Login')
        };
        if (user_register_access()) {
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
        };

        // Form submit handler.
        form.submit.push(function(form, form_state) {
            jdrupal.user_login(
              form_state.values.name,
              form_state.values.pass
            ).success(function(result) {
                drupalgap_goto(drupalgap.settings.front);
            });
        });

        // Place the form into the scope.
        $scope.form = form;*/

      },

      link: function(scope, element) {
        
        dpm('userLoginForm - link');

        // Add the form to the element.
        //element.append(dg_ng_compile_form($compile, scope));

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

