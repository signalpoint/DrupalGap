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
            dg.goto(dg.config('front'));
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
