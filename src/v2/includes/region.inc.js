/**
 *
 */
function drupalgap_render_region(region) {
  try {
    var html = '';
    
    
    html = theme('region', {
        region: region,
        blocks: drupalgap_render_region_blocks(region)
    });
    
    // Open the region.
    
    
    
    // Close the region.
    
    return html;
  }
  catch (error) { console.log('drupalgap_render_region - ' + error); }
}

/**
 *
 */
function drupalgap_render_region_blocks(region) {
  try {
    if (!region.blocks) { return ''; }
    var html = '';
    for (var delta in region.blocks) {
      if (!region.blocks.hasOwnProperty(delta)) { continue; }
      var item = region.blocks[delta];
      html += '<div>' + delta + '</div>';
    }
    return html;
  }
  catch (error) { console.log('drupalgap_render_region_blocks - ' + error); }
}

/**
 *
 */
function theme_region(variables) {
  try {
    var region = variables.region;
    var format = typeof region.format === 'undefined' ?
      'div' : region.format;
    return '<' + format + ' ' + dg_attributes(region.attributes) + '>' +
      variables.blocks +
    '</' + format + '>';
  }
  catch (error) { console.log('theme_region - ' + error); }
}



