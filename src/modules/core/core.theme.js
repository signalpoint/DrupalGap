dg.theme_entity_reference_label = function(variables) {
  var item = variables._item;
  console.log(item);
  console.log(dg.path());
  return dg.l(item.target_id, item.url.replace(dg.path(), ''));
};
dg.theme_string = function(variables) {
  return variables._item.value;
};
dg.theme_number_integer = function(variables) {
  return variables._item.value;
};