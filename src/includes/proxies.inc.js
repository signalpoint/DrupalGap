/**
 * @see jDrupal.isArray()
 */
dg.isArray = function(thing) { return jDrupal.isArray(thing); };

/**
 * @see jDrupal.isEmpty()
 */
dg.isEmpty = function(thing) { return jDrupal.isEmpty(thing); };

/**
 * @see jDrupal.isInt()
 */
dg.isInt = function(thing) { return jDrupal.isInt(thing); };

/**
 * Returns a random string of alpha numeric characters.
 * @see jDrupal.userPassword()
 */
dg.salt = function() { return jDrupal.userPassword.apply(this, arguments); };

dg.currentUser = function() { return jDrupal.currentUser(); };

/**
 * @deprecated
 */
dg.userPassword = function() {
  console.log('dg.userPassword() is deprecated, use dg.salt() instead.');
  return dg.salt.apply(this, arguments);
};
