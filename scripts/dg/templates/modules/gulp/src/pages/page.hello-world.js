example.helloWorldController = function() {

  // Make a translatable greeting for the current user.
  var account = dg.currentUser();
  var msg = account.isAuthenticated() ?
      dg.t('Hello @name.', { '@name': account.getAccountName() }) :
      dg.t('Hello World');

  // Prepare our page's render element.
  var element = {};

  // Add a message as markup to the render element.
  element['my_widget'] = {
    _markup: '<p>' + msg + '</p>'
  };

  // Return the element to be rendered on the page.
  return element;

};
