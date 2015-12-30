dg.currentUser = function() { return jDrupal.currentUser(); };
dg.userPassword = function() { return jDrupal.userPassword.apply(jDrupal, arguments); };