angular.module('dgUser', ['drupalgap'])

// ~ hook_menu()
.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/user/login', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'drupalgap_get_form',
          page_arguments: ['user_login_form']
      });
      $routeProvider.when('/user/logout', {
          templateUrl: 'themes/spi/page.tpl.html',
          controller: 'dg_page_controller',
          page_callback: 'dg_user_logout_callback'
      });
}])

.directive("userLoginForm", function($compile) {
    return {

      controller: function($scope, drupal) {

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

              var action = typeof form.action !== 'undefined' ?
                form.action : 'user/' + data.user.uid;
              drupalgap_goto(action);

            });
        });

        // Place the form into the scope.
        // @TODO placing the form directly into the scope without an id is going to be bad in the long run!
        $scope.form = form;

      },

      link: function(scope, element) {

        // Add the form to the element.
        element.append(dg_ng_compile_form($compile, scope));

      }

    };
});

/**
 *
 */
function dg_user_logout_callback() {
  try {
    var drupal = dg_ng_get('drupal');
    var drupalgapSettings = dg_ng_get('drupalgapSettings');
    drupal.user_logout().then(function(data) {
        drupalgap_goto(drupalgapSettings.front);
    });
  }
  catch (error) { console.log('dg_user_logout_callback - ' + error); }
}

/**
 *
 * @returns {*|Object}
 */

function dg_user_access(permission) {
  try {
    dpm('dg_user_access');
    console.log(arguments);
    var access = false;
    var account = typeof arguments[1] !== 'undefined' ?
      arguments[1] : dg_user_get();
    dpm('checking ' + account.name + ' for ' + permission);
    if (account.uid == 1) { return true; }
    if (!account.permissions) { return false; }
    for (var delta in account.permissions) {
      if (!account.permissions.hasOwnProperty(delta)) { continue; }
      var item = account.permissions[delta];
      if (item.permission == permission) {
        access = true;
        break;
      }
    }
    return access;
  }
  catch (error) {
    console.log('dg_user_access - ' + error);
  }
}
/**
 *
 */
function dg_user_defaults() {
  try {
    return drupal_user_defaults();
  }
  catch (error) { console.log('dg_user_defaults - ' + error); }
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

/**
 * Given a user role (string), this determines if the current user has the role.
 * Returns true if the user has the role, false otherwise. You may pass in a
 * user account object to check against a certain account, instead of the
 * current user.
 * @param {String} role
 * @return {Boolean}
 */
function dg_user_has_role(role) {
  try {
    var has_role = false;
    var account = null;
    if (arguments[1]) { account = arguments[1]; }
    else { account = dg_user_get(); }
    for (var rid in account.roles) {
        if (!account.roles.hasOwnProperty(rid)) { continue; }
        var value = account.roles[rid];
        if (role == value) {
          has_role = true;
          break;
        }
    }
    return has_role;
  }
  catch (error) { console.log('dg_user_has_role - ' + error); }
}


