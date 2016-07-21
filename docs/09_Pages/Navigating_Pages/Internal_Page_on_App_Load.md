The default behavior for DrupalGap is to direct to the front page set in the `settings.js` file. This breaks the sharing feature that users are used to on a typical web site. This code may be added to `settings.js` to enable direction to internal pages.

**This method has only been tested in a web app.**

```
var landingPage = 'dashboard';
if(location.hash){
  // additional logic can be added here for other internal page types and exclude certain pages from being directed to on the initial app load.
  goToPage = location.hash.replace("#","");
  homePage = goToPage.replace('node_', 'node/');
}

// fix drupalgap_back() to not break if coming from external page
function drupalgap_back() {
  try {
    var active_page_id = $('.ui-page-active').attr('id');
    if (active_page_id == drupalgap.settings.front) {
      var msg = t('Exit') + ' ' + drupalgap.settings.title + '?';
      if (drupalgap.settings.exit_message) {
        msg = drupalgap.settings.exit_message;
      }
      drupalgap_confirm(msg, {
          confirmCallback: _drupalgap_back_exit
      });
    }
    else if (active_page_id == '_drupalgap_splash') { return; }
    else if (drupalgap.back_path == ''){
      drupalgap_goto('home_page');
      return;
    }
    else { _drupalgap_back(); }
  }
  catch (error) { console.log('drupalgap_back' + error); }
}

```
Change line 120 `drupalgap.settings.front = 'dashboard';` to `drupalgap.settings.front = landingPage;`