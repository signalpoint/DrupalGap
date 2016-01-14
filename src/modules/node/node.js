dg.modules.node = new dg.Module();

dg.modules.node.routing = function() {
  var routes = {};
  routes["node.add.type"] = {
    "path": "/node\/add\/(.*)",
    "defaults": {
      "_form": 'NodeEdit',
      "_title": "Create content"
    }
  };
  routes["node.add"] = {
    "path": "/node\/add",
    "defaults": {
      "_controller": function() {
        return new Promise(function(ok, err) {
          var items = [];
          for (var bundle in dg.allBundleInfo.node) {
            if (!dg.allBundleInfo.node.hasOwnProperty(bundle)) { continue; }
            items.push(dg.l(dg.allBundleInfo.node[bundle].label, 'node/add/' + bundle));
          }
          var content = {};
          content['types'] = {
            _theme: 'item_list',
            _items: items
          };
          ok(content);
        });
      },
      "_title": "Create content"
    }
  };
  routes["node.edit"] = {
    "path": "/node\/(.*)\/edit",
    "defaults": {
      "_form": 'NodeEdit',
      "_title": "Node edit"
    }
  };
  routes["node"] = {
    "path": "/node\/(.*)",
    "defaults": {
      "_controller": function(nid) {
        return new Promise(function(ok, err) {

          dg.nodeLoad(nid).then(function(node) {
            dg.entityRenderContent(node).then(ok);
          });

        });
      },
      "_title": "Node"
    }
  };
  return routes;
};
