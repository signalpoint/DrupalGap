var dgUser = new dg.Module();

dgUser.routing = function() {
  var routes = {};
  routes["user.login"] = {
    "path": "/user/login",
    "defaults": {
      "_form": 'UserLoginForm',
      "_title": "Log in"
    },
    "requirements": {
      "_user_is_logged_in": false
    }
  };
  return routes;
};
