// @see https://www.drupal.org/developing/api/8/render/arrays

dg._postRender = []; // Holds onto postRenders for the current page's render array(s).

/**
 *
 * @param content
 * @see https://api.drupal.org/api/drupal/core!includes!common.inc/function/render/8
 */
dg.appRender = function(content) {
  dg.themeLoad().then(function(theme) {

    //console.log('theme');
    //console.log(theme);

    /**
     * PREPARATION
     */

    // Clear the regions and start fresh.
    dg.regions = {};
    var regions = theme.getRegions();
    var innerHTML = '';
    var regionCount = theme.getRegionCount();

    /**
     * THIRD - Add region placeholders to html string and inject it into the app container div.
     */

    var finishBlocks = function(allBlocks) {

      //console.log('allBlocks');
      //console.log(allBlocks);

      for (var id in dg.regions) {
        if (!dg.regions.hasOwnProperty(id)) { continue; }
        var region = dg.regions[id];
        var blocks = region.getBlocks();

        // Open the region, render the placeholder for each of its block(s), then
        // close the region.
        var regionFormat = region.get('format');
        innerHTML += '<' + regionFormat  + ' ' + dg.attributes(region.get('attributes')) + '>' + region.get('prefix');
        for (var i = 0; i < blocks.length; i++) {
          var block = allBlocks[blocks[i]];
          var format = block.get('format');
          innerHTML += block.get('prefix') +
              '<' + format + ' ' + dg.attributes(block.get('attributes')) + '></' + format + '>' +
          block.get('suffix');
        }
        innerHTML += region.get('suffix') + '</' + regionFormat + '>';

      }
      innerHTML += dg.render(content);

      // Place the region, and block placeholders, into the app's div.
      document.getElementById('dg-app').innerHTML = innerHTML;

      // Run the build promise for each block, then inject their content as they respond.
      // Keep a tally of all the blocks, and once their promises have all completed, then
      // if there are any forms on the page, attach their UI submit handlers. We don't use
      // a promise all, so blocks can render one by one.
      var blocks = dg.blocksLoad();
      var blocksToRender = [];

      /**
       * FIFTH - Once all blocks have finished rendering, process any forms on the page.
       */

      var finish = function(_block) {

        // Remove this block from the list of blocks to be rendered.
        blocksToRender.splice(blocksToRender.indexOf(_block.get('id')), 1);

        // If we're all done rendering with every block...
        if (blocksToRender.length == 0) {

          // Run any post render functions and reset the queue.
          if (dg._postRender.length) {
            for (var i = 0; i < dg._postRender.length; i++) { dg._postRender[i](); }
            dg._postRender = [];
          }

          // Process the form(s), if any.
          // @TODO form should be processed as they're injected, because waiting
          // until all promises have resolved like this means a form can't be used
          // until they've all resolved.
          var forms = dg.loadForms();
          for (var id in forms) {
            if (!forms.hasOwnProperty(id)) { continue; }
            var form_html_id = dg.killCamelCase(id, '-');
            var form = document.getElementById(form_html_id);
            function processForm(e) {
              if (e.preventDefault) e.preventDefault();
              var _form = dg.loadForm(jDrupal.ucfirst(dg.getCamelCase(this.id)));
              _form._submission().then(
                  function() { },
                  function() { }
              );
              return false; // Prevent default form behavior.
            }
            if (form.attachEvent) { form.attachEvent("submit", processForm); }
            else { form.addEventListener("submit", processForm); }
          }
        }
      };

      /**
       * FOURTH - For any visible blocks, build them then inject their rendered element into their waiting placeholder.
       */

      for (id in blocks) {
        if (!blocks.hasOwnProperty(id)) { continue; }
        blocksToRender.push(id);
        blocks[id].getVisibility().then(function(visibility) {
          if (visibility.visible) {
            visibility.block.buildWrapper().then(function(_block) {
              var _id = dg.cleanCssIdentifier(_block.get('id'));
              var el = document.getElementById(_id).innerHTML = dg.render(_block.get('content'));
              finish(_block);
            });
          }
          else {
            dg.removeElement(dg.cleanCssIdentifier(visibility.block.get('id')));
            finish(visibility.block);
          }
        });
      }

    };

    /**
     * SECOND - Instantiate and invoke alterations on blocks.
     */

    var finishRegions = function() {

      //console.log('dg.regions');
      //console.log(dg.regions);

      // Instantiate the blocks, then give modules a chance to alter them.
      var allBlocks = {};
      for (var id in dg.regions) {
        if (!dg.regions.hasOwnProperty(id)) { continue; }
        var blocks = dg.regions[id].getBlocks();
        for (var i = 0; i < blocks.length; i++) {
          allBlocks[blocks[i]] = dg.blockLoad(blocks[i]);
        }
      }
      jDrupal.moduleInvokeAll('blocks_build_alter', allBlocks).then(finishBlocks(allBlocks));

    };

    /**
     * FIRST - Instantiate and invoke alterations of regions with blocks.
     */

    // Instantiate the regions, skipping any without blocks, then give modules a chance to alter the regions.
    for (var id in regions) {
      if (!regions.hasOwnProperty(id)) { continue; }
      var region = new dg.Region(id, regions[id]);
      if (region.getBlocks().length == 0) { continue; }
      dg.setRenderElementDefaults(region);
      dg.regions[id] = region;
    }
    jDrupal.moduleInvokeAll('regions_build_alter', dg.regions).then(finishRegions);

  });
};

dg.renderProperties = function() {
  return ['_prefix', '_suffix', '_preRender', '_postRender']
};

/**
 *
 * @param content
 * @returns {*}
 * @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!Element!RenderElement.php/class/RenderElement/8
 */
dg.render = function(content) {
    var type = typeof content;
    if (!content) { return ''; }
    if (type === 'string') { return content; }
    var html = '';
    var _html = null;
    if (type === 'object') {
      var prefix = content._prefix ? content._prefix : '';
      var suffix = content._suffix ? content._suffix : '';
      if (typeof prefix === 'object') { prefix = dg.render(prefix); }
      if (typeof suffix === 'object') { suffix = dg.render(suffix); }
      if (typeof content._postRender === 'undefined') { content._postRender = []; }
      if (content.markup) {
        console.log('DEPRECATED: Use "_markup" instead of "markup" in this render array:');
        console.log(content);
        content._markup = content.markup;
      }
      if (content._postRender.length) {
        for (var i = 0; i < content._postRender.length; i++) {
          dg._postRender.push(content._postRender[i]);
        }
      }
      if (content._markup) {
        return prefix + content._markup + suffix;
      }
      if (content._theme) {
        return prefix + dg.theme(content._theme, content) + suffix;
      }
      if (content._type) {
        return prefix + dg.theme(content._type, content) + suffix;
      }
      // @TODO properly handle negative weights.
      var weighted = {};
      var weightedCount = 0;
      html += prefix;
      for (var index in content) {
        if (!content.hasOwnProperty(index) || jDrupal.inArray(index, dg.renderProperties())) { continue; }
        var piece = content[index];
        var _type = typeof piece;
        if (_type === 'object' && piece !== null) {
          var weight = typeof piece._weight !== 'undefined' ? piece._weight : 0;
          if (typeof weighted[weight] === 'undefined') { weighted[weight] = []; }
          weighted[weight].push(dg.render(piece));
          weightedCount++;
        }
        else if (_type === 'array') {
          for (var i = 0; i < piece.length; i++) {
            html += dg.render(piece[i]);
          }
        }
        // @TODO this allows string to be embedded in render elements, but it breaks forms.
        //else if (_type === 'string') { html += piece; }
      }
      if (weightedCount) {
        for (var weight in weighted) {
          if (!weighted.hasOwnProperty(weight)) { continue; }
          for (var i = 0; i < weighted[weight].length; i++) {
            html += weighted[weight][i];
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
};