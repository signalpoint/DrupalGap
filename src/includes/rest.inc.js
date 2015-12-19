// Entity load proxies.
dg.commentLoad = function() {
  return jDrupal.commentLoad.apply(jDrupal, arguments);
};
dg.nodeLoad = function() {
  return jDrupal.nodeLoad.apply(jDrupal, arguments);
};
dg.userLoad = function() {
  return jDrupal.userLoad.apply(jDrupal, arguments);
};