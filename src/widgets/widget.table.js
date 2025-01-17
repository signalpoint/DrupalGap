/**
 * Themes a table.
 * @param {type} vars
 *  _header {Array}
 *  _rows {Array}
 * @returns {String}
 */
dg.theme_table = function(vars) {

  var html = '<table ' + dg.attrs(vars) + '>';

  if (vars._header) {
    html += '<thead><tr>';
    for (var i = 0; i < vars._header.length; i++) {
      var header = vars._header[i];
      if (dg.isObject(header)) {
        html += '<th ' + dg.attrs(header) + ' scope="col">' + header._text + '</th>';
      }
      else {
        html += '<th scope="col">' + header + '</th>';
      }
    }
    html += '</tr></thead>';
  }

  if (vars._rows) {

    html += '<tbody>';

    var renderCol = function(col) {
      return dg.isObject(col) ?
        '<td ' + dg.attrs(col) + '>' + col._data + '</td>' :
        '<td>' + col + '</td>';
    };

    for (var i = 0; i < vars._rows.length; i++) {

      var row = vars._rows[i];

      if (dg.isObject(row)) {
        html += '<tr ' + dg.attrs(row) + '>';
        for (var j = 0; j < row._cols.length; j++) {
          var col = row._cols[j];
          html += renderCol(col);
        }
        html += '</tr>';
      }

      else if (dg.isArray(row)) {
        html += '<tr>';
        for (var j = 0; j < row.length; j++) {
          var col = row[j];
          html += renderCol(col);
        }
        html += '</tr>';
      }

    }

    html += '</tbody>';

  }

  html += '</table>';

  return html;

};
