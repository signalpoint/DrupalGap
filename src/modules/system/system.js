dg.modules.system = new dg.Module();

dg.modules.system.routing = function() {
  var routes = {};
  routes["system.dashboard"] = {
    "path": "/dg",
    "defaults": {
      "_title": "Getting started",
      _controller: function() {
        return new Promise(function(ok, err) {
          var content = {};
          var account = dg.currentUser();

          // Show welcome message.
          var msg = 'Welcome to DrupalGap, ';
          if (account.isAuthenticated()) { msg += account.getAccountName() + '!'; }
          else { msg += dg.l('click here', 'user/login') + ' to login to your app.'; }
          content['welcome'] = { _markup: '<p>' + msg + '</p>' };

          // Add getting started info.
          content['header'] = {
            _markup: '<h2>' + dg.t('Resources') + '</h2>'
          };
          content['resources'] = {
            _theme: 'item_list',
            _items: [
                dg.l(dg.t('Hello World'), 'http://docs.drupalgap.org/8/Hello_World'),
                dg.l(dg.t('Create a Module'), 'http://docs.drupalgap.org/8/Modules/Create_a_Custom_Module')
            ]
          };

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
  blocks.powered_by = {
    build: function () {
      return new Promise(function(ok, err) {
        ok(dg.t('Powered by: ') + dg.l('DrupalGap', 'http://drupalgap.org'));
      });
    }
  };
  blocks.title = {
    build: function () {
      return new Promise(function(ok, err) {
        var title = dg.getTitle();
        if (typeof title === 'string') {
          var element = {
            _theme: 'title',
            _title: dg.t(title)
          };
          ok(element);
        }
        else { ok(title); }
      });
    }
  };
  return blocks;
};
