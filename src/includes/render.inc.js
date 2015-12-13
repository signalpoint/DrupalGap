dg.render = function(content) {
  try {
    var type = typeof content;
    console.log('content: ' + type);
    if (type === 'string') { return content; }
    var html = '';
    var _html = null;
    if (type === 'object') {
      if (content.markup) {
        _html = content.markup;
        if (content.prefix) { _html = content.prefix + _html; }
        if (content.suffix) { _html += content.suffix; }
        return _html;
      }
      if (content.theme) {
        _html = theme(content.theme, content);
        if (content.prefix) { _html = content.prefix + _html; }
        if (content.suffix) { _html += content.suffix; }
        return _html;
      }
      if (content.prefix) { html = content.prefix + html; }
      for (var index in content) {
        if (
          !content.hasOwnProperty(index) ||
          index == 'prefix' || index == 'suffix'
        ) { continue; }
        var piece = content[index];
        var _type = typeof piece;
        console.log('piece: ' + _type);
        if (_type === 'object') { html += dg_render(piece); }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += dg.render(piece[i]);
          }
        }
      }
      if (content.suffix) { html += content.suffix; }
    }
    else if (type === 'array') {
      for (var i = 0; i < content.length; i++) {
        html += dg.render(content[i]);
      }
    }
    return html;
  }
  catch (error) { console.log('dg.render - ' + error); }
};