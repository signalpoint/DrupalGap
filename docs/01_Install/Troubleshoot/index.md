Other troubleshooting topics are listed on d.o.:

https://drupal.org/node/2015065

More troubleshooting topics are listed below, please feel free to add any information to help others.

## Module Installation Problems

The Views JSON module needed by DrupalGap is a sub module of the [Views Datasource](https://drupal.org/project/views_datasource) module. There is another Drupal module called [Views JSON](https://drupal.org/project/views_json), ***do not*** install this module.

### SDK Installation Problems

#### drupalgap-sdk.zip
```
Warning: file_put_contents(drupalgap-sdk.zip): failed to open stream: Permission denied in drupalgap_sdk_form_submit()
```
This means the folder where Drupal's index.php file lives (typically public_html or www) is not writable by the web server. This is usually resolved by granting write permissions to that folder for the web server. It is advised to contact your server administrator if you are unable to grant write permissions to that folder.

## System Connect Failed

This [particular comment](https://www.drupal.org/node/2305493#comment-9155291) stresses the basics to resolving and/or debugging this problem: Otherwise, see the following issues for more information:

 - https://www.drupal.org/node/1884184
 - https://www.drupal.org/node/2051853
 - https://www.drupal.org/node/2305493
 - https://github.com/signalpoint/DrupalGap/issues/53

## Module Upgrade Problems

When updating the DrupalGap module, or upgrading to the latest development snapshot, sometimes it may be necessary to disable and uninstall the module, then delete the module's files from your Drupal site. After that, download the latest release (or development snapshot), then re-enable the module.

## Problems with Custom or Contributed Modules inside the DrupalGap SDK

The most comon problem faced when working with custom or contributed moudules inside of the DrupalGap SDK, is the following error:

**Failed to load module! (module_name_here)**

99% of the time this means there is a syntax error in the .js file of the module. Check the file contents to make sure there are no syntax errors with your custom module. If it is a contributed module, check to make sure you copied the JS file properly, and it doesn't include any bogus html that may have been accidentally copied from GitHub.

Other potential reasons for modules failing to load:

 - check the directory/file permissions on the module, make sure they can be read
 - avoid using symlinks, this may cause module to fail to load
 - make sure the module .js file lives here, for example: www/app/modules/module_name/module_name.js

## Debugging Ripple

When using Ripple to develop DrupalGap mobile applications, you may run into a few bumps in the road along the way.

***Do not*** use the URL text field provided on http://emulate.phonegap.com.

If Ripple fails to start, click the Ripple icon in Chrome to enable it.
Origin http://localhost is not allowed by Access-Control-Allow-Origin

In Ripple, under Settings, make sure Cross Domain Proxy is not "disabled"
Ripple Fails to Emulate

Sometimes selecting 2.0.0 for the Cordova emulator results in failed emulation. Try selecting 1.0.0 and then 'firing' the 'deviceready' event using the controls in the Ripple sidebars.
Viewing an Entity Doesn't Render any Fields

Make sure you go to 'Manage display' for your content type, then adjust the settings for the 'DrupalGap' display mode. For example, in Drupal go to: admin/structure/types/manage/article/display/drupalgap
xCode
Flushing All Simulator Caches and Build Cache Intermediates

iOS Simulator -> Reset Content & Settings

xCode -> Product -> Clean

xCode -> Window -> Organizer -> Projects (Tab) -> (Delete Derived Data)
406 Not Acceptable

On some servers, when trying to use a PUT command with the Node Update Service Resource, the server may respond with a 406 Not Acceptable error. A possible way around this is to disable the mod_security rule in Apache. This Apache Mod may be preventing any PUT Request Methods to the server (Method is not allowed by policy).
jQuery Mobile 1.4.2

On some Android tables, jQuery Mobile 1.4.2 may not work properly and result in the pages being rendered improperly (i.e. only the placeholder names in the page.tpl.html file get rendered). Downgrading to jQuery Mobile 1.4.1 or 1.4.0 .js and .css files, seems to resolve this issue.

> theme_views_view - TypeError: Cannot read property 'root' of undefined

Your Views JSON page display `Format` needs to be set to `JSON data document`.
