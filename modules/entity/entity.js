function drupalgap_entity_get_info(entity_type) {
  try {
    if (entity_type == null) {
      drupalgap_module_invoke_all('entity_info');
    }
    else {
      drupalgap_module_invoke(entity_type, 'entity_info');
    }
  }
  catch (error) {
    alert('drupalgap_entity_get_info - ' + error);
  }
}

