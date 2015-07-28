angular.module('dg_autocomplete', ['drupalgap'])
.directive('dgAutocomplete', ['$http', 'drupalSettings', function($http, drupalSettings) {
    return {
        restrict:'AE',
        scope: { },
        templateUrl:'/src/v2/modules/dg_autocomplete/dg_autocomplete.html',
        link:function(scope,elem,attrs){
          scope.suggestions = [];
          scope.selectedIndex = -1; //currently selected suggestion index
          scope.search = function() {
            var path =
              drupalSettings.sitePath + drupalSettings.basePath +
              attrs.dgUrl + '?title=' + scope.searchText;
              $http.get(path).success(function(data) {
                 if(data.indexOf(scope.searchText)===-1){
                     data.unshift(scope.searchText);
                 }
                 scope.suggestions=data;
                 scope.selectedIndex=-1;
              });
          }
          scope.checkKeyDown=function(event){
             if(event.keyCode===40){//down key, increment selectedIndex
                 event.preventDefault();
                 if(scope.selectedIndex+1 !== scope.suggestions.length){
                     scope.selectedIndex++;
                 }
             }
             else if(event.keyCode===38){ //up key, decrement selectedIndex
                 event.preventDefault();
                 if(scope.selectedIndex-1 !== -1){
                     scope.selectedIndex--;
                 }
             }
             else if(event.keyCode===13){ //enter pressed
                 scope.resultClicked(scope.selectedIndex);
             }
          }
          scope.resultClicked=function(index){
            alert('you selected: ' + scope.suggestions[index].nid);
                   scope.searchText='';
                   scope.suggestions=[];
          }
        }
   }
}]);

/**
 *
 */
function theme_autocomplete(variables) {
  try {
    variables.attributes['dg-autocomplete'] = '';
    variables.attributes['dg-url'] = variables.path;
    variables.attributes['model'] = 'data.tags';
    return '<div ' + dg_attributes(variables.attributes) + '></div>';
  }
  catch (error) { console.log('theme_autocomplete - ' + error); }
}

