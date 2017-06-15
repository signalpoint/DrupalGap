dg.currentUser = function() { return jDrupal.currentUser(); };
dg.userPassword = function() { return jDrupal.userPassword.apply(jDrupal, arguments); };
dg.hasRole = function(role) { return jDrupal.currentUser().hasRole(role); };
dg.isAdmin = function() { return dg.hasRole('administrator'); };