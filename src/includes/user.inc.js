dg.hasRole = function(role) { return jDrupal.currentUser().hasRole(role); };
dg.isAdmin = function() { return dg.hasRole('administrator'); };
