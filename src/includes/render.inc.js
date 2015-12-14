dg.render = function(content) {
  try {
    var type = typeof content;
    console.log('content: ' + type);
    if (type === 'string') { return content; }
    var html = '';
    var _html = null;
    if (type === 'object') {
      var prefix = content._prefix ? content._prefix : '';
      var suffix = content._suffix ? content._suffix : '';
      if (content._markup) {
        return prefix + content._markup + suffix;
      }
      if (content._theme) {
        return prefix + dg.theme(content._theme, content) + suffix;
      }
      if (content._type) {
        return prefix + dg.theme(content._type, content) + suffix;
      }
      html += prefix;
      for (var index in content) {
        if (
          !content.hasOwnProperty(index) ||
          index == '_prefix' || index == '_suffix'
        ) { continue; }
        var piece = content[index];
        var _type = typeof piece;
        console.log('piece: ' + _type);
        if (_type === 'object') { html += dg.render(piece); }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += dg.render(piece[i]);
          }
        }
      }
      html += suffix;
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