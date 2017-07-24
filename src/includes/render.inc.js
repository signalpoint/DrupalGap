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
        if (!blocks.length) { continue; } // Skip regions without blocks.

        // Open the region, render the placeholder for each of its block(s), then
        // close the region.
        var regionFormat = region.get('format');
        innerHTML += region.get('before') + '<' + regionFormat  + ' ' + dg.attributes(region.get('attributes')) + '>' + region.get('prefix');
        for (var i = 0; i < blocks.length; i++) {
          var block = allBlocks[blocks[i]];
          var format = block.get('format');
          innerHTML += block.get('before') +
              '<' + format + ' ' + dg.attributes(block.get('attributes')) + '></' + format + '>' +
          block.get('after');
        }
        innerHTML += region.get('suffix') + '</' + regionFormat + '>' + region.get('after');

      }
      innerHTML += dg.render(content);

      // Place the region, and block placeholders, into the app's div.
      document.getElementById('dg-app').innerHTML = innerHTML;
      window.scrollTo(0,0);

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
          dg.runPostRenders();

          // Process the form(s), if any.
          // @TODO form should be processed as they're injected, because waiting
          // until all promises have resolved like this means a form can't be used
          // until they've all resolved.
          var forms = dg.loadForms();
          for (var id in forms) {
            if (!forms.hasOwnProperty(id)) { continue; }
            dg.formAttachSubmissionHandler(id);
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
              var el = document.getElementById(_id);
              var rendered = dg.render(_block.get('content'));
              if (el) { el.innerHTML = rendered; }
              else {
                // The element isn't in the DOM yet, set a timeout to wait for it.
                setTimeout(function(elId) {
                  var el = document.getElementById(elId);
                  if (el) { el.innerHTML = rendered; }
                }, 1, _id);
              }
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
     * FIRST - Instantiate and invoke alterations of regions.
     */

    // Instantiate the regions and give modules a chance to alter the regions. We let regions without blocks
    // go through here because a block build alter allows developers to potentially add a block to region
    // after this.
    for (var id in regions) {
      if (!regions.hasOwnProperty(id)) { continue; }
      var region = new dg.Region(id, regions[id]);
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
 * @param content {*}
 * @param runPostRender {Boolean} Optional, set to true to run post renders after returning html, defaults to false.
 * @returns {*}
 * @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!Element!RenderElement.php/class/RenderElement/8
 */
dg.render = function(content, runPostRender) {
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
  if (runPostRender) { setTimeout(dg.runPostRenders, 1); }
    return html;
};

/**
 * Returns the number of `_postRender` functions that are queued up.
 * @returns {Number}
 */
dg.postRenderCount = function() {
  return dg._postRender.length;
};

/**
 * This will run through any of the queued up `_postRender` functions then reset the queue.
 */
dg.runPostRenders = function(timeout, milliseconds) {
  if (typeof timeout === 'undefined') { timeout = false; }
  if (typeof milliseconds === 'undefined') { milliseconds = 1; }
  var done = function() {
    var count = dg.postRenderCount();
    if (count) {
      for (var i = 0; i < count; i++) {

        // Prevent runaway post render invocations potentially caused by uncaught exceptions in the
        // developer's function(s).
        if (count > dg._postRenderMax) {
          console.log('dg._postRenderMax reached: ' + dg._postRenderMax);
          dg._postRender = [];
          break;
        }

        // Run the post render function.
        dg._postRender[i]();
      }

      // Clear the queue.
      dg._postRender = [];
    }
  };
  if (timeout) { setTimeout(done, milliseconds); }
  else { done(); }
};
