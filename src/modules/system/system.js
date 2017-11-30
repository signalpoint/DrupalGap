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
          else { msg += dg.l('click here', 'http://docs.drupalgap.org/8') + ' to view the documentation.'; }
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
  routes['system.403'] = {
    path: '/403',
    defaults: {
      _title: '403 - Access denied',
      _controller: function() {
        return new Promise(function(ok, err) {
          var element = {
            msg: {
              _theme: 'message',
              _type: 'warning',
              _message: dg.t('You do not have access to this page.')
            }
          };
          // @TODO not working for some reason.
          //console.log(dg.currentUser().isAnonymous(),  dg.getPath());
          //if (dg.currentUser().isAnonymous() && dg.getPath() != '403') {
          //
          //  element.login = {
          //    _theme: 'form',
          //    _id: 'UserLoginForm'
          //  };
          //
          //}
          //console.log(element);
          ok(element);
        });

      }
    }
  };
  routes['system.404'] = {
    path: '/404',
    defaults: {
      _title: '404 - Page not found',
      _controller: function() {
        return new Promise(function(ok, err) {
          ok(dg.t('Sorry, that page was not found.'));
        });

      }
    }
  };
  return routes;
};

dg.modules.system.blocks = function() {
  var blocks = {};
  blocks.logo = {
    build: function () {
      return new Promise(function(ok, err) {
        ok(dg.config('logo'));
      });
    }
  };
  blocks.main = {
    build: function () {
      return new Promise(function(ok, err) {
        ok(dg.content);
      });
    }
  };
  blocks.main_menu = {
    build: function () {
      return new Promise(function(ok, err) {
        var content = {};
        var items = [ dg.l(dg.t('Home'), '') ];
        content['menu'] = {
          _theme: 'item_list',
          _items: items
        };
        ok(content);
      });
    }
  };
  blocks.primary_local_tasks = dg.modules.system.blockPrimaryLocalTasks();
  blocks.powered_by = {
    build: function () {
      return new Promise(function(ok, err) {
        var content = {};
        content['list'] = {
          _theme: 'item_list',
          _title: dg.t('Powered by'),
          _items: [dg.l('DrupalGap', 'http://drupalgap.org'), dg.l('Drupal', 'http://drupal.org')]
        };
        ok(content);
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
  blocks.messages = {
    build: function () {
      return new Promise(function(ok, err) {
        if (!dg.getMessageCount()) { ok(); return; }
        var element = {};
        var messages = dg.getMessages();
        for (var i = 0; i < messages.length; i++) {
          element['msg' + i] = messages[i];
        }
        dg.clearMessages();
        ok(element);
      });
    }
  };
  return blocks;
};

/**
 * Implements hook_pre_process_route_change
 */
function system_pre_process_route_change(newPath, oldPath) {

  // Only make alterations to the 2nd route change and beyond, skip the initial route change during application startup.
  if (typeof oldPath !== 'undefined') {

    // Remove potential "no-[region:id]" class names from the body.before we change the route.
    var blocks = dg.blocksLoad();
    for (var name in blocks) {
      if (!blocks.hasOwnProperty(name)) { continue; }
      var block = blocks[name];
      var region = block.getRegion(); // Upon initial boot, a block's region may not be set yet, so we check below.
      if (region && region.getHiddenBlocks().length == region.getBlocks().length) {
        dg.removeBodyClass('no-' + region.get('id'));
      }
    }

  }

}

/**
 * A form submit handler for config forms. Iterates over each element on the form and sticks its form state value into
 * local storage.
 * @param form
 * @param formState
 */
dg.modules.system.configFormSubmit = function(form, formState) {
  for (var name in form) {
    if (!dg.isFormElement(name, form) || name == 'actions') { continue; }
    dg.setVar(name, formState.getValue(name));
  }
};
