/**
 * Given an argument, this will return true if it is an int, false otherwise.
 * @param {Number} n
 * @return {Boolean}
 */
function dg_is_int(n) {
  // Credit: http://stackoverflow.com/a/3886106/763010
  if (typeof n === 'string') { n = parseInt(n); }
  return typeof n === 'number' && n % 1 == 0;
}

