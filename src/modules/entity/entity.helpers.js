/**
 * Given an entity type and optional bundle, this will return the view mode machine name to use.
 * It defaults to "drupalgap", but can be configured.
 * @param {String} entity_type
 * @param {String} bundle
 * @returns {string}
 * @see http://docs.drupalgap.org/7/Entities/Display_Modes
 */
function drupalgap_entity_view_mode(entity_type, bundle) {
  var view_mode = 'drupalgap';
  if (typeof drupalgap.settings.view_modes !== 'undefined') {
    if (entity_type && bundle) {
      if (
        drupalgap.settings.view_modes[entity_type] &&
        drupalgap.settings.view_modes[entity_type][bundle] &&
        drupalgap.settings.view_modes[entity_type][bundle].view_mode
      ) { view_mode = drupalgap.settings.view_modes[entity_type][bundle].view_mode; }
    }
    else if (entity_type) {
      if (
          drupalgap.settings.view_modes[entity_type] &&
          drupalgap.settings.view_modes[entity_type].view_mode
      ) { view_mode = drupalgap.settings.view_modes[entity_type].view_mode; }
    }
  }
  return view_mode;
}

/**
 * Given an entity type, id and optional context, this will return a container id to be used
 * when constructing a placeholder to load/display/edit an entity.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {String} context An optional context to use, e.g. "edit"
 * @returns {string}
 */
function drupalgap_get_entity_container_id(entity_type, entity_id, context) {
  var id = 'dg-entity-container-' + entity_type + '-' + entity_id;
  if (context) { id += '-' + context; }
  return id;
}

/**
 * A page_callback function used to build an empty placeholder for an entity and inline
 * JavaScript to retrieve the entity for display.
 * @param {String} handler
 * @param {String} entity_type
 * @param {Number} entity_id
 * @returns {string}
 */
function drupalgap_get_entity(handler, entity_type, entity_id) {
  return '<div ' + drupalgap_attributes({
    id: drupalgap_get_entity_container_id(entity_type, entity_id),
    'class': 'dg-entity-container ' + entity_type
  }) + '></div>' + drupalgap_jqm_page_event_script_code({
    jqm_page_event_callback: 'drupalgap_get_entity_pageshow',
    jqm_page_event_args: JSON.stringify({
      handler: handler,
      entity_type: entity_type,
      entity_id: entity_id
    })
  });
}

/**
 * A pageshow function used to retrieve an entity, pass it along to its handler for rendering,
 * and then inject the handler's render array into the waiting placeholder.
 * @param {Object} options
 */
function drupalgap_get_entity_pageshow(options) {
  entity_load(options.entity_type, options.entity_id, {
    success: function(entity) {
      var id = drupalgap_get_entity_container_id(options.entity_type, options.entity_id);
      $('#' + id).html(drupalgap_render(window[options.handler](entity))).trigger('create');
    }
  });
}

/**
 * A page_callback function used to build an empty placeholder for an entity and inline
 * JavaScript to retrieve the entity for editing.
 * @param {String} handler
 * @param {String} entity_type
 * @param {Number} entity_id
 * @returns {string}
 */
function drupalgap_get_entity_form(handler, entity_type, entity_id) {
  return '<div ' + drupalgap_attributes({
        id: drupalgap_get_entity_container_id(entity_type, entity_id, 'edit'),
        'class': 'dg-entity-container ' + entity_type
      }) + '></div>' + drupalgap_jqm_page_event_script_code({
        jqm_page_event_callback: 'drupalgap_get_entity_form_pageshow',
        jqm_page_event_args: JSON.stringify({
          handler: handler,
          entity_type: entity_type,
          entity_id: entity_id
        })
      });
}

/**
 * A pageshow function used to retrieve an entity, pass it along to a form builder, and then
 * inject the form into the waiting placeholder.
 * @param {Object} options
 */
function drupalgap_get_entity_form_pageshow(options) {
  entity_load(options.entity_type, options.entity_id, {
    success: function(entity) {
      var id = drupalgap_get_entity_container_id(options.entity_type, options.entity_id, 'edit');
      $('#' + id).html(drupalgap_get_form(options.handler, entity)).trigger('create');
    }
  });
}
