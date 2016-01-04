var dgNode = new dg.Module();

dgNode.routing = function() {
  var routes = {};
  routes["node"] = {
    "path": "/node\/(.*)",
    "defaults": {
      "_controller": function(nid) {
        return new Promise(function(ok, err) {

          dg.nodeLoad(nid).then(function(node) {
            ok(dg.entityRenderContent(node));
          });

        });
      },
      "_title": "Node"
    }
  };
  return routes;
};
