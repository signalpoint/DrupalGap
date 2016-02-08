dg.modules.user = new dg.Module();

dg.modules.user.routing = function() {
  var routes = {};
  routes["user.login"] = {
    "path": "/user/login",
    "defaults": {
      "_form": 'UserLoginForm',
      "_title": "Log in"
    }
  };
  routes["user.logout"] = {
    "path": "/user/logout",
    "defaults": {
      "_title": "Log out",
      _controller: function() {
        return new Promise(function(ok, err) {
          ok('Logging out...');
          jDrupal.userLogout().then(function() {
            dg.goto(dg.getFrontPagePath());
          });
        });

      }
    }
  };
  routes["user"] = {
    "path": "/user\/(.*)",
    "defaults": {
      "_controller": function(uid) {
        return new Promise(function(ok, err) {

          dg.userLoad(uid).then(function(user) {
            dg.entityRenderContent(user).then(ok);
          });

        });
      },
      "_title": "user"
    }
  };
  return routes;
};

/**
 * Blocks defined by the user module.
 * @returns {Object}
 */
dg.modules.user.blocks = function() {
  var blocks = {};
  blocks['user_login'] = {
    build: function () {
      return new Promise(function(ok, err) {
        var authenticated = dg.currentUser().isAuthenticated();
        if (!authenticated && dg.getPath() != 'user/login') {
          var form = dg.addForm('UserLoginForm', dg.applyToConstructor(UserLoginForm));
          form.get('form')._action = dg.getPath();
          form.getForm().then(ok);
        }
      });
    }
  };
  blocks['user_menu'] = {
    build: function () {
      return new Promise(function(ok, err) {
        if (dg.currentUser().isAuthenticated()) {
          var content = {};
          content['menu'] = {
            _theme: 'item_list',
            _items: [
              dg.l(dg.t('My account'), 'user/' + dg.currentUser().id()),
              dg.l(dg.t('Logout'), 'user/logout')
            ]
          };
          ok(content);
        }
        else { ok(); }
      });
    }
  };
  return blocks;
};
