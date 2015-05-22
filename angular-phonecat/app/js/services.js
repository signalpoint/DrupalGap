'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);


function jDrupal($http) {
  this.node_load = function(nid) {
    return $http.get('http://localhost/drupal-7/?q=drupalgap/node/' + nid + '.json');
  }
}
angular.module('jdrupal-ng', []).
    service('jdrupal', ['$http', jDrupal]);


