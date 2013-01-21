$('#drupalgap_page_user_register').on('pageshow',function(){
  try {
    if (drupalgap.user.uid != 0) {
      navigator.notification.alert(
        'Already logged in!',
        function(){
          $.mobile.changePage(drupalgap.settings.front);
        },
        'Error',
        'OK'
      );
      return false;
    }
    drupalgap_form_render('user_register', '#drupalgap_page_user_register .content');
  }
  catch (error) {
    alert("drupalgap_page_user_register - pageshow - " + error);
  }
});

