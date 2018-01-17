dg.isArray = function(thing) { return jDrupal.isArray(thing); };

/**
 * Returns a random string of alpha numeric characters.
 * @see jDrupal.userPassword()
 */
dg.salt = function() { return jDrupal.userPassword.apply(this, arguments); };
