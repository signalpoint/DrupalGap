'use strict';

// Configure the angular-drupal module.
angular.module('angular-drupal').config(function($provide) {
    $provide.value('drupalSettings', {
        site_path: 'http://localhost/drupal-7',
        base_path: '/',
        endpoint: 'drupalgap',
        language: 'und',
        file_public_path: 'sites/default/files', // use public or private
        //file_private_path: 'system/files',
    });
    
});

// Configure the drupalgap module.
angular.module('drupalgap').config(function($provide) {
    $provide.constant('drupalgapSettings', {
        
        // Front page.
        front: 'dg',
        
        // Modules.
        modules: {
          core: {
            admin: { },
            entity: { },
            field: { },
            image: { },
            services: { },
            system: { },
            text: { },
            user: { }
          },
          contrib: { },
          custom: { },
        },
        
        // Menus.
        menus: {
          
          // Anonymous user menu.
          user_menu_anonymous: {
            links: [
              {
                title: 'Login',
                path: 'user/login',
                options: {
                  attributes: {
                    
                  }
                }
              },
              {
                title: 'Register',
                path: 'user/register',
                options: {
                  attributes: {
                    
                  }
                }
              }
            ],
            attributes: {
              'class': 'nav navbar-nav'
            }
          },
          
          // Authenticated user menu.
          user_menu_authenticated: {
            links: [
              {
                title: 'My account',
                path: 'user',
                options: {
                  attributes: {
                    
                  }
                }
              },
              {
                title: 'Logout',
                path: 'user/logout',
                options: {
                  attributes: {
                    
                  }
                }
              }
            ],
            attributes: {
              'class': 'nav navbar-nav'
            }
          },

          admin_menu: {
            links: [
              {
                title: t('Administer'),
                path: 'admin'
              }
            ],
            attributes: {
              'class': 'nav navbar-nav'
            }
          }
          
          
        },
        
        // Theme.
        theme: {
          
          name: 'spi',
          path: 'themes',
          
          // Regions.
          regions: {
            
            // Header region.
            header: {

              format: 'nav', // wrap in a nav element instead of a div
              attributes: {
                'class': 'navbar navbar-inverse navbar-fixed-top'
              },

              blocks: {
                
                // Anonymous user menu block.
                user_menu_anonymous: {
                  roles: {
                    value: ['anonymous user'],
                    mode: 'include'
                  }
                },
                
                // Authenticated user menu block.
                user_menu_authenticated: {
                  roles: {
                    value: ['authenticated user'],
                    mode: 'include'
                  }
                },
                
              }

            },
            
            // Content region.
            content: {
              
              attributes: {
                'class': 'container'
              },

              blocks: {
                
                // Main page content block..
                main: { }

              }

            },
            
            // Footer region.
            footer: {

              format: 'footer', // wrap in a footer element instead of a div
              attributes: {
                'class': 'footer'
              },

              blocks: {

                // Administration block.
                admin_menu: {
                  roles: {
                    value: ['administrator'],
                    mode: 'include'
                  }
                }

              }

            },

          }

        } // ./theme

    });
});

// Run the App!
dgApp.run(['drupal', function(drupal) {
      
      // Start building your app here...
      
}]);

