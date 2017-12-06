dg.hasAttachments = function(content) { return !!content._attached; };
dg.addAttachments = function(content) {

  // Grab the libraries attached to the content, if any. Then iterate over each of the modules in the attachment to
  // process their libraries.
  var promises = [];
  var attachments = content._attached;
  for (var moduleName in attachments) {
    if (!attachments.hasOwnProperty(moduleName)) { continue; }

    // Grab the attachment, then load each library on the attachment, queueing up the promises returned by
    // libraryLoad().
    var attachment = attachments[moduleName];
    for (var i = 0; i < attachment.length; i++) {
      var libraryName = attachment[i];
      promises.push(dg.libraryLoad(moduleName, libraryName));
    }

  }
  return Promise.all(promises);

};

dg.libraryLoad = function(moduleName, libraryName) {
  return new Promise(function(ok, err) {

    // If the library has already been added, don't do it again, just resolve.
    if (dg.libraryLoaded(moduleName, libraryName)) {
      //console.log('library already added!', moduleName, libraryName);
      ok();
      return;
    }
    //console.log('library not yet added', moduleName, libraryName);

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
          //console.log('done loading asset, assets left: ' + assetsLoading);

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

        //console.log('loading asset', asset);
        
        // Add the asset's file to the head, then circle back to the onload handler.
        //console.log('LOADING: ' + moduleName + '/' + libraryName);
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
