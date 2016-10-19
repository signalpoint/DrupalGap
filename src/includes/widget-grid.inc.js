function theme_jqm_grid(variables) {
  if (!variables.items || !variables.items.length) { return ''; }

  var html = '';

  // Determine columns, and jqm grid type and css class..
  var columns = jqm_grid_verify_columns(variables);
  var grid = jqm_grid_get_type(columns);
  variables.attributes.class += ' ui-grid-' + grid + ' ';

  var open = '<div ' + drupalgap_attributes(variables.attributes) + '>';
  var close = '</div>';
  var open_row = '<div class="ui-block">'; // This class will be replaced dynamically.
  var close_row = '</div>';

  html += open;
  for (var i = 0; i < variables.items.length; i++) {
    var className = jqm_grid_get_item_class(i, columns);
    var openRow = jqm_grid_set_item_row_class(open_row, className);
    html += openRow + variables.items[i] + close_row;
  }
  html += close;

  return html;
}

function jqm_grid_verify_columns(variables) {
  var columns = variables.columns ? variables.columns : 2;
  var msg = null;
  if (columns < 2) {
    msg = columns + ' columns is not enough, a minimum of 2 is needed';
    columns = 2;
  }
  if (columns > 5) {
    msg = columns + ' columns is too many enough, a maximum of 5 is allowed';
    columns = 5;
  }
  variables.columns = columns;
  if (msg) { console.log('jqm_grid_verify_columns - ' + msg); }
  return variables.columns;
}

function jqm_grid_get_type(columns) {
  var grid = null;
  switch (columns) {
    case 2: grid = 'a'; break;
    case 3: grid = 'b'; break;
    case 4: grid = 'c'; break;
    case 5: grid = 'd'; break;
  }
  return grid;
}

function jqm_grid_get_item_class(index, columns) {
  var className = null;
  switch (index % columns) {
    case 0: className = 'ui-block-a'; break;
    case 1: className = 'ui-block-b'; break;
    case 2: className = 'ui-block-c'; break;
    case 3: className = 'ui-block-d'; break;
    case 4: className = 'ui-block-e'; break;
  }
  return className
}

function jqm_grid_set_item_row_class(open_row, className) {
  var openRow = JSON.parse(JSON.stringify(open_row)); // Make a copy of the string.
  if (className) { openRow = openRow.replace('ui-block', className); }
  return openRow;
}
