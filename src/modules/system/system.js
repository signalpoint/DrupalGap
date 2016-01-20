dg.modules.system = new dg.Module();

dg.modules.system.routing = function() {
  var routes = {};
  routes["system.dashboard"] = {
    "path": "/dg",
    "defaults": {
      "_title": "DrupalGap Dashboard",
      _controller: function() {
        return new Promise(function(ok, err) {
          var content = {};
          var msg = 'Welcome to DrupalGap, ';
          var account = dg.currentUser();
          if (account.isAuthenticated()) {
            msg += account.getAccountName() + '!';
          }
          else {
            msg += dg.l('click here', 'user/login') + ' to login to your app.';
          }
          content['msg'] = { _markup: '<p>' + msg + '</p>' };
          ok(content);
        });

      }
    }
  };
  routes["system.404"] = {
    "path": "/404",
    "defaults": {
      "_title": "404 - Page not found",
      _controller: function() {
        return new Promise(function(ok, err) {
          ok('Sorry, that page was not found...');
        });

      }
    }
  };
  return routes;
};

dg.modules.system.blocks = function() {
  var blocks = {};
  blocks.main = {
    build: function () {
      return new Promise(function(ok, err) {
        ok(dg.content);
      });
    }
  };
  return blocks;
};