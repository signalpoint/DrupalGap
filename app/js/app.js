'use strict';

// Configure the angular-drupal module.
angular.module('angular-drupal').config(function($provide) {
    $provide.value('drupalSettings', {
        //site_path: Drupal.settings.site_path,
        //endpoint: Drupal.settings.endpoint
        site_path: 'http://localhost/drupal-7',
        endpoint: 'drupalgap',
        language: 'und',
        theme: {
          name: 'spi',
          path: 'themes'
        }
    });
    
});

// Configure the drupalgap module.
angular.module('drupalgap').config(function($provide) {
    console.log('drupalgap - config');
    $provide.constant('drupalgapSettings', {
        
        // Modules.
        modules: {
          core: {
            system: {},
            user: {},
          },
          contrib: { },
          custom: { },
        },
        
        // Theme.
        theme: {
          
          name: 'spi',
          path: 'themes',
          
          // Regions.
          regions: {
            
            // Header.
            header: {
              format: 'nav', // wrap in a nav element instead of a div
              attributes: {
                'class': 'navbar navbar-inverse navbar-fixed-top'
              }
            },
            
            // Content.
            content: {
              attributes: {
                'class': 'container'
              },
              blocks: {
                
                // Page content.
                main: {
                  foo: 'bar'
                }

              }
            },
            
            // Footer.
            footer: {
              format: 'footer', // wrap in a footer element instead of a div
              attributes: {
                'class': 'footer'
              }
            },
          }

        }

    });
});

// Run the App!
dgApp.run(['drupal', function(drupal) {
      drupal.connect().then(function(data) {
          console.log(data);
      });
}]);

