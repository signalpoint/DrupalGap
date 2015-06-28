/**
 *
 */
function drupalgap_render_region(region) {
  try {
    return theme('region', {
        region: region,
        blocks: drupalgap_render_region_blocks(region)
    });
  }
  catch (error) { console.log('drupalgap_render_region - ' + error); }
}

/**
 *
 */
function drupalgap_render_region_blocks(region) {
  try {
    //dpm('drupalgap_render_region_blocks');
    //console.log(region);
    if (!region.blocks) { return ''; }
    var html = '';
    for (var delta in region.blocks) {
      if (!region.blocks.hasOwnProperty(delta)) { continue; }
      var block = region.blocks[delta];
      if (dg_check_visibility(block)) {
        html += drupalgap_render_block(delta, block);
      }
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
    //dpm('theme_region');
    //console.log(variables);
    var region = variables.region;
    var format = typeof region.format === 'undefined' ?
      'div' : region.format;
    return '<' + format + ' ' + dg_attributes(region.attributes) + '>' +
      variables.blocks +
    '</' + format + '>';
  }
  catch (error) { console.log('theme_region - ' + error); }
}

