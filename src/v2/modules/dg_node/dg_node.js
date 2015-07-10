angular.module('dg_node', ['drupalgap']);

/**
 *
 */
function node_index_page(nodes) {
  try {
    var html = '';
    var rows = [];
    for (var i in nodes) {
      var node = nodes[i];
      rows.push([
        l(t(node.title), 'node/' + node.nid),
        node.type,
        l(node.uid, 'user/' + node.uid),
        node.status,
        node.changed,
        theme('item_list', {
          items: [
            l(t('edit'), 'node/' + node.nid + '/edit'),
            l(t('delete'), null)
          ]
        })
      ]);
    }
    html += theme('table', {
      header: [
        { data: t('Title') },
        { data: t('Type') },
        { data: t('Author') },
        { data: t('Status') },
        { data: t('Updated') },
        { data: t('Operations') },
      ],
      rows: rows,
      attributes: {
        'class': 'table' /* @TODO this is bootstrap specific */
      }
    });
    return html;
  }
  catch (error) {
    console.log('node_index_page - ' + error);
  }
}
