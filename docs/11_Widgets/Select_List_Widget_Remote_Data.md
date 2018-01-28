Here's an approach to creating a remote query list of available Select List items. In this example, create a custom page for users to select their location (country, administrative_area, locality) instead of typing it into the default address fields. The _locality_ field uses remote data to populate the __Select List__. There are two reasons for this ... (1) users don't always spell locations correctly so it makes it difficult to geocode a location, (2) it's easier for users to select an item from a list instead of typing.

Disclaimer: The examples below show the basis of how to get the Select List to work. Signifcant amounts of code has been removed from __my_module.js__ functions to hopefully make it easy to understand the basic process for remotely populating the items for a Select List widget. The code shown for __my_module.module__ is complete and formats the output correctly to be used for a Select List.

To start, first create a table (let's call it _my_locations_) in your drupal database with three columns: _country_, _administrative_area_, _locality_. Next you need to populate the table with data ... a task outside the scope of this example.

On your Drupal website, add the following to __my_module.module__.


    /**
     * Implements hook_menu().
     */
    function my_module_menu() {
     $items['drupalgap/select-list-cities'] = array(
        'page callback' => '_my_module_option_list_cities',
        'access arguments' => array('access content'),
        'type' => MENU_CALLBACK
      );
      return $items;
    }

    function _my_module_option_list_cities() {

      if (!empty($_GET['country']) AND !empty($_GET['admin_area'])) {
        
        $country = $_GET['country'];
        $admin_area = $_GET['admin_area'];

        $results = db_select('my_locations', 'ml')
          ->fields('ml', array('locality'))
          ->condition('country', $country, '=')
          ->condition('administrative_area', $admin_area, '=')
          ->orderBy('locality', 'ASC')
          ->range(0, 500)
          ->execute()
          ->fetchAll();
        
      } else if (!empty($_GET['country']) AND empty($_GET['admin_area'])) {
        
        $country = $_GET['country'];
        
        $country_list = array('AE','AR','AU','BR','CA','CL','CN','CO','EE','EG','ES','HK','ID','IE','IN','IT','JM','JP','KR','KZ','MX','MY','PE','RU','TR','TW','UA','US','VE');
          
        if (in_array($country, $country_list)) {

          $results = '';
        
        } else {
        
          $results = db_select('my_locations', 'ml')
            ->fields('ml', array('locality'))
            ->condition('country', $country, '=')
            ->orderBy('locality', 'ASC')
            ->range(0, 500)
            ->execute()
            ->fetchAll();
        
        }
        
      } else {  
        
        $results = '';
        
      }

      $count = count($results);

      if ($count > 0) {
        
        $string = '';
        
        $open = '{';
        
        $string .= $open;
        
        $i = 1;
        
        foreach ($results as $result) {

          // assign variables
          $locality = $result->locality;
          
          // echo $locality . "<br />";;
          
          $string .= '"' . $locality . '":"' . $locality . '"';
          
          if ($i < $count) {
            $string .= ',';
          }
          
          $i++;
          
        }
        
        $close = '}';
        
        $string .= $close;
        
      }
      
      echo $string;
      
      drupal_exit(); 
      
    }
    
    
In __my_module.js__ in your app, here's what your page callback might look like:


    function my_module_page() {
      try {

        get_localities();
        var load_localities = window.localStorage.getItem('locality_data');
        
        if (!empty(load_localities)) { 
          var localities = $.parseJSON(load_localities);
        } else {
          var localities = '';
        }
        
        if (Drupal.user.field_user_address.length != 0) {
        
          var selected_locality = Drupal.user.field_user_address.und['0']['locality'];

        } else {
          
          var selected_locality = '';
          
        }

        var content = {};    

        content['user_location_locality'] = {
          theme: 'select',
          options: localities,
          value: selected_locality,
          attributes: {
            id: 'user_location_locality',
            onchange: 'settings_user_location_locality()'
          }
        };

        return content;    
        
      }
      catch (error) { console.log('my_module_page - ' + error); }
    }

    
Here is an example function you would add in your __my_module.js__ file to get the list of items and then save it to local storage:


    function get_localities() {
      try {
            
        if (Drupal.user.field_user_address.length != 0) {
      
          var path = 'http://example.com/drupalgap/select-list-cities' + '?' + 'country=' + selected_country + '&' + 'admin_area=' + selected_admin_area;

          // Remove from local storage.
          window.localStorage.removeItem('locality_data');
          
          $.ajax({
            async: false,
            type: 'GET',
            url: path,
            success: function(data) {
              window.localStorage.setItem('locality_data', data);        
            }
          });    
          
          var option_list_locality = window.localStorage.getItem('locality_data');
          // console.log('Data = ' + option_list_locality);

        } else {
          var option_list_locality = '';
        }
        
        return option_list_locality;
        
      }
      catch (error) { console.log('get_localities - ' + error); }
    }


