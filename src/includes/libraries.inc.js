dg._attachments = {};
dg.clearAttachments = function() { dg._attachments = {}; };
dg.setAttachment = function(name, attachment) { dg._attachments[name] = attachment; }
dg.getAttachment = function(name) { return dg._attachments[name]; }

dg.hasAttachments = function(content) { return !!content._attached; };

dg.addAttachments = function(content) {

  var loadAttachment = function(moduleName, attachment) {

    return new Promise(function(ok, err) {

//      console.log('loading attachment...', moduleName, attachment);

      dg.setAttachment(moduleName, attachment);

      var libraryCount = attachment.length;
      var librariesProcessed = 0;
      var libraryDelta = 0;

      var loadLibrary = function() {

        var libraryName = null;
        var libraryIsObject = dg.isObject(attachment[libraryDelta]);

        libraryName = libraryIsObject ?
          attachment[libraryDelta].name :
          attachment[libraryDelta];

        if (dg.libraryLoaded(moduleName, libraryName)) {
          console.log('library already loaded', moduleName, libraryName);
          librariesProcessed++;
          libraryDelta++;
          ok();
          return;
        }

        var library = dg.getModuleLibrary(moduleName, libraryName);
//        console.log(moduleName, libraryName, library);

        var jsAssetCount = library.js ? library.js.length : 0;
        var cssAssetCount = library.css ? library.css.length : 0;
//        console.log('jsAssetCount', jsAssetCount);
//        console.log('cssAssetCount', cssAssetCount);

        var jsAssetsProcessed = 0;
        var jsDelta = 0;
        var cssAssetsProcessed = 0;
        var cssDelta = 0;

        var loadJsAsset = function() {

          var jsAsset = library.js[jsDelta];
//          console.log('jsAsset', jsAsset);

          jsAsset._attributes['data-module'] = moduleName;
          jsAsset._attributes['data-library'] = libraryName;

          // Set up our onload handler.
          jsAsset._attributes.onload = function() {
            jsAssetsProcessed++;
            jsDelta++;
//            console.log('loaded', jsAsset._attributes.src);
            if (jsAssetsProcessed < jsAssetCount) {
//              console.log('loaded a js asset, moving to the next');
              loadJsAsset();
            }
            else {
//              console.log('all done loading js assets, moving to the next library');
              librariesProcessed++;
              libraryDelta++;

              // Mark the library as loaded.
              var libs = dg.getLibraries();
              if (!libs[moduleName]) { libs[moduleName] = {}; }
              if (!libs[moduleName][libraryName]) { libs[moduleName][libraryName] = {}; }

              // Give modules a chance to react to the completion of a loaded library..
              jDrupal.moduleInvokeAll('library_onload', moduleName, libraryName);

              if (librariesProcessed < libraryCount) {
                loadLibrary();
              }
              else { ok(); }
            }
          };
          dg.addJs(jsAsset);

        };

        var loadCssAsset = function() {

          var cssAsset = library.css[cssDelta];
//          console.log('cssAsset', cssAsset);

          cssAsset._attributes['data-module'] = moduleName;
          cssAsset._attributes['data-library'] = libraryName;

          // Set up our onload handler.
          cssAsset._attributes.onload = function() {
            cssAssetsProcessed++;
            cssDelta++;
//            console.log('loaded', cssAsset._attributes.href);
            if (cssAssetsProcessed < cssAssetCount) {
//              console.log('loaded a css asset, moving to the next');
              loadCssAsset();
            }
            else {
//              console.log('all done loading css assets, moving to the next library');
              librariesProcessed++;
              libraryDelta++;

              // Mark the library as loaded.
              var libs = dg.getLibraries();
              if (!libs[moduleName]) { libs[moduleName] = {}; }
              if (!libs[moduleName][libraryName]) { libs[moduleName][libraryName] = {}; }

              // Give modules a chance to react to the completion of a loaded library..
              jDrupal.moduleInvokeAll('library_onload', moduleName, libraryName);

              if (librariesProcessed < libraryCount) {
                loadLibrary();
              }
              else { ok(); }
            }
          };
          dg.addCss(cssAsset);

        };

        if (jsAssetsProcessed < jsAssetCount) {
          loadJsAsset();
        }

        if (cssAssetsProcessed < cssAssetCount) {
          loadCssAsset();
        }

      };

      loadLibrary();

    });

  };

  var promises = [];
  var attachments = content._attached;
  for (var moduleName in attachments) {
    if (!attachments.hasOwnProperty(moduleName)) { continue; }
    var attachment = attachments[moduleName];
    if (!jDrupal.isArray(attachment)) { continue; }
    promises.push(loadAttachment(moduleName, attachment));
  }
  return Promise.all(promises);




  return;

  // Grab the libraries attached to the content, if any. Then iterate over each of the modules in the attachment to
  // process their libraries.
  var promises = [];
  var attachments = content._attached;
  for (var moduleName in attachments) {
    if (!attachments.hasOwnProperty(moduleName)) { continue; }

    // Figure out what kind of attachment it is, a simple array of library names, or a more complex object with
    // configuration.
    var attachment = attachments[moduleName];
    console.log(attachment);
    return;


    for (var i = 0; i < attachment.length; i++) {
      var libraryName = attachment[i];
      dg.libraryLoadSync(moduleName, libraryName);
    }
    continue;




    if (dg.isObject(attachment)) {
      if (attachment.async === false) {
        for (var i = 0; i < attachment.libraries.length; i++) {
          var libraryName = attachment.libraries[i];
          dg.libraryLoad(moduleName, libraryName, {
            async: false
          });
        }
      }
    }
    else {
      if (dg.isString(attachment)) { attachment = [attachment]; } // Convert single strings into an array.

      // load each library on the attachment, queueing up the promises returned by libraryLoad().
      for (var i = 0; i < attachment.length; i++) {
        var libraryName = attachment[i];
        promises.push(dg.libraryLoad(moduleName, libraryName));
      }
    }

  }
  return Promise.all(promises);

};

dg.libraryLoad = function(moduleName, libraryName) {
  return new Promise(function(ok, err) {

    // If the library has already been added, don't do it again, just resolve.
    if (dg.libraryLoaded(moduleName, libraryName)) {
      console.log('library already added!', moduleName, libraryName);
      ok();
      return;
    }
    console.log('library not yet added', moduleName, libraryName);

    // Load up the library configuration from the module.
    var library = dg.getModuleLibrary(moduleName, libraryName);

    // Specify which asset types we allow and count them.
    var assetTypes = ['js', 'css'];
    var assetTypesCount = assetTypes.length;
    var assetType = null;
    var assetCount = 0;

    // First figure out how many assets we are going to load.
    var assetsLoading = 0;
    for (var i = 0; i < assetTypesCount; i++) {
      assetType = assetTypes[i];

      // If the module's library doesn't provide this asset type, then skip it.
      if (!library[assetType]) { continue; }

      // The module's library has an asset(s) for this type, count how many.
      assetsLoading += library[assetType].length;
    }

    // Iterate over the types of assets we allow...

    for (var i = 0; i < assetTypesCount; i++) {
      assetType = assetTypes[i];

      // If the module's library doesn't provide this asset type, then skip it.
      if (!library[assetType]) { continue; }

      // The module's library has an asset(s) for this type, count how many.
      assetCount = library[assetType].length;

      // Iterate over each asset of this type...
      for (var j = 0; j < assetCount; j++) {
        var asset = library[assetType][j];

        // Set up our onload handler.
        asset._attributes.onload = function() { // @TODO all library implementors to have their own onload too.

          // Mark an asset as loaded.
          assetsLoading--;
          console.log('done loading asset, assets left: ' + assetsLoading);

          // Once we're done loading all the assets...
          if (!assetsLoading) {

            // Mark the library as loaded.
            var libs = dg.getLibraries();
            if (!libs[moduleName]) { libs[moduleName] = {}; }
            if (!libs[moduleName][libraryName]) { libs[moduleName][libraryName] = {}; }

            // Give modules a chance to react to the completion of a loaded library..
            jDrupal.moduleInvokeAll('library_onload', moduleName, libraryName);

            // Resolve.
            ok();
          }

        };

        console.log('loading asset', asset);

        // Add the asset's file to the head, then circle back to the onload handler.
        console.log('LOADING: ' + moduleName + '/' + libraryName);
        assetType == 'js' ? dg.addJs(asset) : dg.addCss(asset);

      }

    }

  });
};

dg.libraryLoaded = function(moduleName, libraryName) {
  var libs = dg._libraries;
  return !!(libs[moduleName] && libs[moduleName][libraryName]);
};

dg.getLibraries = function() {
  return dg._libraries;
};

dg.getModuleLibraries = function(moduleName) {
  return dg.invoke(moduleName, 'libraries');
};

dg.getModuleLibrary = function(moduleName, libraryName) {
  var libraries = dg.getModuleLibraries(moduleName);
  return libraries[libraryName];
};

dg.getModuleRoutes = function(moduleName) {
  return dg.invoke(moduleName, 'routing');
};

dg.removeLibraries = function() {

  var libraries = dg.getLibraries();
//  console.log('libraries', libraries);

  for (var module in libraries) {

    if (!dg.hop(libraries, module)) { continue; }

//    console.log(module, libraries[module]);

    for (var library in libraries[module]) {

      if (!dg.hop(libraries[module], library)) { continue; }

      var options = dg.getModuleLibrary(module, library);
//      console.log(options);

      var suffix = '[data-module="' + module + '"][data-library="' + library + '"]';
      var removeElements = function(elements) {
        for (var i = 0; i < elements.length; i++) {
          console.log('removing', elements[i]);
          elements[i].remove();
        }
      };

      if (options.js) {
        var selector = 'head script' + suffix;
        var scripts = document.querySelectorAll(selector);
        if (scripts) { removeElements(scripts); }
      }

      if (options.css) {
        var selector = 'head link' + suffix;
        var links = document.querySelectorAll(selector);
        if (links) { removeElements(links); }
      }

    }

  }

}
