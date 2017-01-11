In some cases, it might be inconvenient or not intuitive for users to modify their settings at __user/%/edit__ from the __My Account__ link. Below is an example of creating a __Settings__ page for toggling checkboxes on/off and automatically writing the changes to the database without the user having to save the page.

## 1. Implements hook_block_view()
```
/**
 * Implements hook_block_view().
 */
function my_module_block_view(delta, region) {
  try {
    
    var content = '';
    
    switch (delta) {
    
      case 'my_panel_block_right':

        var attrs = {
          id: drupalgap_panel_id(delta),
          'data-role': 'panel',
          'data-position': 'right', // left or right
          'data-display': 'overlay' // overlay, reveal or push
        };
        var items = [];
    
        if (Drupal.user.uid == 0) {
          items.push(bl('Login', 'user/login', {
              attributes: {
                'data-icon': 'lock',
                'class': 'menulinks'
              },
              reloadPage:true
          }));
        } else {
          items.push(bl('My Account', 'user/' + Drupal.user.uid, {
              attributes: {
                'data-icon': 'lock',
                'class': 'menulinks'
              },
              reloadPage:true
          }));
          
          items.push(bl('My Avatar', 'avatar', {
              attributes: {
                'data-icon': 'lock',
                'class': 'menulinks'
              },
              reloadPage:true
          }));

          items.push(bl('Settings', 'settings/' + Drupal.user.uid, {
              attributes: {
                'data-icon': 'lock',
                'class': 'menulinks'
              },
              reloadPage:true
          }));
          
          items.push(bl('Logout', 'user/logout', {
              attributes: {
                'data-icon': 'lock',
                'class': 'menulinks'
              },
              reloadPage:true
          }));

          
        }
    
        // Finally theme the menu.
        content += '<div ' + drupalgap_attributes(attrs) + '>' +
          '<!-- panel content goes here -->' +
          theme('jqm_item_list', { items: items }) +
        '</div><!-- /panel -->';

      break;
        
      // The button to open the menu.
      case 'my_panel_block_button_right':

        if (Drupal.user.uid) {
     
          var attrs = {
            'data-type': 'horizontal',
            'class': 'ui-btn-right'
          };
          
          var content = '<div ' + drupalgap_attributes(attrs) + '>' +
          bl('Open panel', '#' + drupalgap_panel_id('my_panel_block_right'), {
              attributes: {
                'data-icon': 'user',
                'data-iconpos': 'notext',
              }
          }) +
          bl('Back Button', null, {
              attributes: {
                'data-icon': 'back',
                'data-iconpos': 'notext',
                'onclick': 'javascript:drupalgap_back();',
              }
          }) +
          '</div>';
          
        }
        
      break;
      
    }
    return content;
  }
  catch (error) { console.log('my_module_block_view - ' + error); }
}
```

## 2. Implements hook_menu()
```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['settings/%'] = {
    title: 'Settings',
    page_callback: 'my_module_user_settings_page',
    options:{
      reloadPage:true
    }
  };
  
  return items;
}
```

## 3. Create your custome page with checkboxes
```
function my_module_user_settings_page() {
  try {
    
    var content = {};
    
    content['enable_email_notifications'] = {
      theme: 'checkbox',
      attributes: {
        id: 'enable_email_notifications',
        onchange: 'user_settings_enable_email_notifications()'
      }
    },
    content['enable_mobile_notification'] = {
      theme: 'checkbox',
      attributes: {
        id: 'enable_mobile_notification',
        onchange: 'user_settings_enable_mobile_notification()'
      }
    },
    content['notify_new_events'] = {
      theme: 'checkbox',
      attributes: {
        id: 'notify_new_events',
        onchange: 'user_settings_notify_new_events()'
      }
    };
        
    content['my_checkbox_label_1'] = {
      theme: 'form_element_label',
      element: {
        title: 'Enable Email Notifications',
        attributes: {
          'for': 'enable_email_notifications'
        }
      }
    },
    content['my_checkbox_label_2'] = {
      theme: 'form_element_label',
      element: {
        title: 'Enable Mobile Notifications',
        attributes: {
          'for': 'enable_mobile_notification'
        }
      }
    },
    content['my_checkbox_label_3'] = {
      theme: 'form_element_label',
      element: {
        title: 'Notify on New Events in Joined Groups',
        attributes: {
          'for': 'notify_new_events'
        }
      }
    };
        
    var een = Drupal.user.field_enable_email_notifications.und['0']['value'];
    if(een == 1) { content['enable_email_notifications'].attributes.checked = 'checked'; }
        
    var emn = Drupal.user.field_enable_mobile_notification.und['0']['value'];
    if(emn == 1) { content['enable_mobile_notification'].attributes.checked = 'checked'; }
    
    return content;    
    
  }
  catch (error) { console.log('my_module_user_settings_page - ' + error); }
}
```


## 4. Call back function for field 1
```
function user_settings_enable_email_notifications() {

  // get value of checkbox
  var een = Drupal.user.field_enable_email_notifications.und['0']['value'];
  
  // box has been unchecked
  if(een == '1') {
    var account = {
      uid: Drupal.user.uid,
      field_enable_email_notifications: { und: null }
    };
    Drupal.user.field_enable_email_notifications.und['0']['value'] = '0';
  }
  
  // box has been checked
  if(een == '0') {
    var account = {
      uid: Drupal.user.uid,
      field_enable_email_notifications: { und: [ { value: '1' } ] }
    };
    Drupal.user.field_enable_email_notifications.und['0']['value'] = '1';
  }
  
  // update user settings on server
  user_update(account, {
    success: function(result) {
      drupalgap_toast('<p>Updated!</p>', 1000);
    }
  });  
  
}
```

## 5. Call back funcction for field 2
```
function user_settings_enable_mobile_notification() {

  // get value of checkbox
  var een = Drupal.user.field_enable_mobile_notification.und['0']['value'];
  
  // box has been unchecked
  if(een == '1') {
    var account = {
      uid: Drupal.user.uid,
      field_enable_mobile_notification: { und: null }
    };
    Drupal.user.field_enable_mobile_notification.und['0']['value'] = '0';
  }
  
  // box has been checked
  if(een == '0') {
    var account = {
      uid: Drupal.user.uid,
      field_enable_mobile_notification: { und: [ { value: '1' } ] }
    };
    Drupal.user.field_enable_mobile_notification.und['0']['value'] = '1';
  }
  
  // update user settings on server
  user_update(account, {
    success: function(result) {
      drupalgap_toast('<p>Updated!</p>', 1000);
    }
  });  
  
}
```
