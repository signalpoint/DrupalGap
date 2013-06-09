/**
 * Given a module name and model type, this will return the collection JSON object.
 */
function collection_load(module, type) {
  try {
    return JSON.parse(window.localStorage.getItem(drupalgap_mvc_get_collection_key('collection', module, type)));
  }
  catch (error) {
    alert('collection_load - ' + error);
  }
}

/**
 * Given a module name and model type, this will return the collection JSON object.
 */
function collection_save(module, type, collection) {
  try {
    window.localStorage.setItem(drupalgap_mvc_get_collection_key('collection', module, type), JSON.stringify(collection));
  }
  catch (error) {
    alert('collection_save - ' + error);
  }
}

/**
 * Given a bucket (e.g. collection, settings), module name and mvc model type,
 * this will return the local storage key used for the model type's item collection.
 */
function drupalgap_mvc_get_collection_key(bucket, module, model_type) {
  try {
    return 'mvc_' + bucket + '_' + module + '_' + model_type;
  }
  catch (error) {
    alert('drupalgap_mvc_get_collection_key - ' + error);
  }
}

/**
 *
 */
function drupalgap_mvc_init() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_mvc_init()');
    }
    // Load models...
    // For each module that implements hook_mvc_model(), iterate over each model
    // placing it into drupalgap.mvc.models, each model will be placed into
    // a namespace according to the module that implements it, to avoid namespace
    // collisions.
    var modules = module_implements('mvc_model');
    for (var i = 0; i < modules.length; i++) {
      var module = modules[i];
      var models = module_invoke(module, 'mvc_model');
      if (models) {
        // Create namespace for model, keyed by module name.
        if (!eval('drupalgap.mvc.models.' + module)) {
          eval('drupalgap.mvc.models.' + module + ' = {};');
        }
        // For each model type...
        $.each(models, function(model_type, model){
            // Set the primary key 'id', the module name, and model type
            // on the model fields.
            model.fields.id = {
              "type":"hidden",
              "title":"ID",
              "required":false
            };
            model.fields.module = {
              "type":"hidden",
              "title":"Module",
              "required":true,
              "default_value":module,
            };
            model.fields.type = {
              "type":"hidden",
              "title":"Model Type",
              "required":true,
              "default_value":model_type,
            };
            // Add each model type to its namespace within drupalgap.mvc.models
            eval('drupalgap.mvc.models.' + module + '.' + model_type + ' = model;');
            // Save an empty collection to local storage for this model type.
            window.localStorage.setItem(
              drupalgap_mvc_get_collection_key('collection', module, model_type),
              '[]'
            );
            // Save settings for the collection to local storage. The auto
            // increment value represents an item id, we start counting at zero
            // since the collection is an array.
            window.localStorage.setItem(
              drupalgap_mvc_get_collection_key('settings', module, model_type),
              '{"auto_increment":0}'
            );
        });
      }
    }
    //console.log(JSON.stringify(drupalgap.mvc.models));
    //alert('drupalgap_mvc_init');
    // These may not be needed. Perhaps we should just call assumed hooks that
    // should be implemented for any custom views and controllers at the time
    // they are needed, probably no need to bundle them inside drupalgap.mvc.
    //var views = module_invoke_all('mvc_view');
    //var controllers = module_invoke_all('mvc_controller');
  }
  catch (error) {
    alert('drupalgap_mvc_init - ' + error);
  }
}

// We'll need developer friendly front end functions, e.g.
// model_load();
// model_save();
// model_delete();
// item_load();
// item_save();
// item_delete();
// etc...

/**
 * Given a module name and a corresponding model name, this will load the model
 * from drupalgap.mvc.models.
 */
function drupalgap_mvc_model_load(module, name) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_mvc_model_load(' + module + ', ' + name + ')');
    }
    if (drupalgap.mvc.models[module] === 'undefined' || drupalgap.mvc.models[module][name] === 'undefined') {
      return false;
    }
    return drupalgap.mvc.models[module][name];
  }
  catch (error) {
    alert('drupalgap_mvc_model_load - ' + error);
  }
}

/**
 * Given a module name, and model name, this generates and returns the form JSON
 * object to create a model item.
 */
function drupalgap_mvc_model_create_form(module, name) {
   try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_mvc_model_create_form(' + module + ', ' + name + ')');
    }
    var form = false;
    var model = drupalgap_mvc_model_load(module, name);
    if (model) {
      form = {
        id:"drupalgap_mvc_model_create_form",
        elements:model.fields
      };
      form.buttons = {
        cancel:{"title":"Cancel"}
      };
      form.elements.submit = {
        type:"submit",
        value:"Create"
      };
    }
    return form;
  }
  catch (error) {
    alert('drupalgap_mvc_model_create_form - ' + error);
  }
}

/**
 *
 */
/*function drupalgap_mvc_model_create_form_validate(form, form_state) {
  
}*/

/**
 *
 */
function drupalgap_mvc_model_create_form_submit(form, form_state) {
  try {
    item_save(form_state.values);
  }
  catch (error) {
    alert('drupalgap_mvc_model_create_form_submit - ' + error);
  }
}

/**
 *
 */
function item_save(item) {
  try {
    if (typeof item === 'undefined') { return false; }
    
    // Grab the settings for this collection.
    var settings_key = drupalgap_mvc_get_collection_key('settings', item.module, item.type);
    var settings = JSON.parse(window.localStorage.getItem(settings_key));
    
    // If there is no id, then this is a new item, grab the next id to use.
    if (!item.id) {
      item.id = settings.auto_increment;
    }
    // Load the collection from local storage.
    var collection = collection_load(item.module, item.type);
    
    // Add the item onto the collection.
    collection[item.id] = item; 
      
    // Save the collection to local storage.
    collection_save(item.module, item.type, collection);
    
    // Increment to the next item id and save the settings.
    settings.auto_increment = item.id + 1;
    window.localStorage.setItem(settings_key, JSON.stringify(settings));
    
    return true;  
  }
  catch (error) {
    alert('item_save - ' + error);
  }
}

