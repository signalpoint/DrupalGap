/**
 * Implements hook_entity_view().
 */
function hook_entity_view(build, entity) {
  return new Promise(function(ok, err) {

    // Add a custom paragraph to all nodes.
    if (entity.getEntityType() == 'node') {
      build['foo'] = {
        _markup: '<p>bar</p>'
      };
    }

    ok();
  });
}