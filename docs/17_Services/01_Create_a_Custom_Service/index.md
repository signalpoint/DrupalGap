

Often times, we'll need custom Services on our Drupal site for our app to communicate with. Using the Services 3.X API and a custom Drupal module, we can accomplish this.

## 1. Create a Custom Drupal Module

Create a directory for your custom Drupal module on your Drupal site:

`~/www/sites/all/modules/custom/my_module`

Create these empty files in the new directory:

- my_module.info
- my_module.module
- my_module.resource.inc
- my_module.services.inc

### my_module.info

Place this code in the `my_module.info` file:

```
name = My Module
description = My custom Drupal module.
package = Other
core = 7.x
dependencies[] = services
dependencies[] = rest_server
```

### my_module.module

Place this code in the `my_module.module` file:

```
<?php

/**
 * Implements hook_ctools_plugin_api().
 */
function my_module_ctools_plugin_api($owner, $api) {
  if ($owner == 'services' && $api == 'services') {
    return array(
      'version' => 3,
      'file' => 'my_module.services.inc'
    );
  }
}
```

### my_module.services.inc

Place this code in the `my_module.services.inc` file:

```
<?php

function my_module_services_resources() {
  $resources = array(
    'my_module_resources' => array(
      'actions' => array(
        'get_user_count' => array(
          'help' => t('Gets a count of users.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'my_module',
            'name' => 'my_module.resource',
          ),
          'callback' => 'my_module_get_user_count',
          'args' => array(),
          'access callback' => '_drupalgap_resource_access',
          'access callback file' => array(
            'type' => 'inc',
            'module' => 'drupalgap',
            'name' => 'drupalgap.resource',
          ),
          'access arguments' => array('access user profiles'),
          'access arguments append' => TRUE,
        ),
      ),
    ),
  );
  return $resources;
}
```

### my_module.resource.inc

Place this code in the `my_module.resource.inc` file:

```
<?php

function my_module_get_user_count() {
  return db_query("SELECT COUNT(uid) FROM {users}")->fetchField();
}
```

## 2. Enable the Custom Drupal Module

Go to `admin/modules` on your Drupal site, and enable **My Module**.

## 3. Give Anonymous Users Access to the Resource

On your Drupal site:

1. Go to `admin/people/permissions`
2. Check the box next to **View user profiles** under the **Anonymous User** column
3. Click the **Save permission** button.

## 4. Enable the Custom Service Resource

On your Drupal site:

1. Go to `admin/structure/services/list/drupalgap/resources`
2. Expand the **my_module_resources** under the **Resource** column
3. Check the box next to **get_user_count**
4. Click the **Save** button at the bottom of the form.
5. Flush all of Drupal's Caches at `admin/config/development/performance`

## 5. Test the Custom Service Resource

Our new Custom Service Resource will be available at a URL like this:

`http://www.example.com/?q=drupalgap/my_module_resources/get_user_count.json`

Let's use [FireFox Poster](https://addons.mozilla.org/en-US/firefox/addon/poster/) to test it out:

1. Open FireFox
2. Logout of your Drupal site (if you're logged in)
3. Open FireFox Poster under **Tools -> Poster**
4. Enter the URL listed above into the URL field, replacing example.com with your domain
5. Click the **Body from Parameters** button
6. Click the **POST** button

If all goes well, we'll get a **200 OK** response, and we'll be returned the numbers of users on our site, inside a JSON array. For example, if our site had 33 users:

`["33"]`

If you get a "CSRF validation failed" response, you need to log out of your Drupal site in FireFox before using Poster, or you can use this technique to attach the X-CSRF-Token header.

That's it! You now have a Custom Service Resource on your Drupal website that the mobile app can communicate with.
