Hooks are used to **hook** into the DrupalGap mobile app dev kit. For example, to **hook** into the moment when your custom DrupalGap module is installed, use `hook_install()` like so:

```
/**
 * Implements hook_install().
 */
function my_module_install() {
  console.log('My module is being installed!');
  // Do stuff...
}
```

A listing of hooks is available below.


## hook_deviceready
```
/**
 * Implements hook_deviceready
 */
function example_deviceready() {
}
```

## hook_init
```
/**
 * Implements hook_init
 */
function example_init() {
}
```

## hook_form_alter
```
/**
 * Implements hook_form_alter
 */
function example_form_alter() {
}
```

## hook_regions_build_alter
```
/**
 * Implements hook_regions_build_alter
 */
function example_regions_build_alter() {
}
```

## hook_blocks_build_alter
```
/**
 * Implements hook_blocks_build_alter
 */
function example_blocks_build_alter() {
}
```

## hook_block_view_alter
```
/**
 * Implements hook_block_view_alter
 */
function example_block_view_alter() {
}
```

## hook_pre_process_route_change

This hook can be implemented in one of two ways:

 1. To alter the destination path (optional, and to execute other custom code)
 2. To execute custom code

```
// OPTION 1

/**
 * Implements hook_pre_process_route_change
 */
function example_pre_process_route_change(newPath, oldPath) {
  return new Promise(function(ok, err) {

      // If something happened...
      if (example.somethingHappened()) {

        // Send them to a different path instead.
        newPath = 'example-path';

        // Do some other stuff.
        example.doOtherStuff();

      }

      // Resolve the new path, even if it didn't change.
      ok(newPath);

  });
}

// OPTION 2

/**
 * Implements hook_pre_process_route_change
 */
function example_pre_process_route_change(newPath, oldPath) {

  // Pre process initial route change upon application startup...
  if (typeof oldPath === 'undefined') {

  }
  else {
  
  // Handle all other route changes...

  }

}
```

## hook_post_process_route_change
```
/**
 * Implements hook_post_process_route_change().
 */
function example_post_process_route_change(route, newPath, oldPath) {

  // Post process initial route change upon application startup...
  if (typeof oldPath === 'undefined') {

  }
  else {
    
    // Handle all other route changes...

  }

}

```

## hook_entity_view
```
/**
 * Implements hook_entity_view
 */
function example_entity_view() {
}
```
