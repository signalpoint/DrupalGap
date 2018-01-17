dg.currentUser = function() { return jDrupal.currentUser(); };

/**
 * @deprecated
 */
dg.userPassword = function() {
  console.log('dg.userPassword() is deprecated, use dg.salt() instead.');
  return dg.salt.apply(this, arguments);
};

dg.hasRole = function(role) { return jDrupal.currentUser().hasRole(role); };
dg.isAdmin = function() { return dg.hasRole('administrator'); };
