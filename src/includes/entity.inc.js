/**
 * A proxy to create an instance of a jDrupal Node object.
 * @param nid_or_node
 * @returns {jDrupal.Node}
 * @constructor
 */
dg.Node = function(nid_or_node) { return new jDrupal.Node(nid_or_node); };

/**
 * A handy route _controller used to retrieve an entity from the server and send it along to the route's _handler.
 * @param entityId
 * @returns {object} A render element.
 */
dg.entityController = function(entityId) {

  // Use a bucket as a placeholder for the entity.
  var element = {};
  element.entity = {
    _theme: 'bucket',
    _grab: function() {

      // Load the route, determine the entity type, and the entity's load function name.
      var route = dg.router.getActiveRoute();
      var entityType = route.defaults._entity_type;
      var loadFunctionName = dg.getCamelCase(entityType) + 'Load';

      // Get the entity from Drupal, then send it and the bucket fill and dump callbacks to the _handler on the route.
      return new Promise(function(fill, dump) {
        dg[loadFunctionName](entityId).then(function(entity) {
          route.defaults._handler(entity, fill, dump);
        });
      });

    }
  };
  return element;

};
