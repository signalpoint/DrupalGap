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