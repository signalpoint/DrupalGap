dg.hasClass = function(el, className) {
  return el.classList.contains(className);
};

dg.addClass = function(el, className) {
  if (!dg.hasClass(el, className)) { el.classList.add(className); }
};

dg.removeClass = function(el, className) {
  if (dg.hasClass(el, className)) { el.classList.remove(className); }
};

dg.getBody = function() {
  return document.getElementsByTagName("BODY")[0];
};

dg.addBodyClass = function(className) {
  dg.addClass(dg.getBody(), className);
};

dg.removeBodyClass = function(className) {
  dg.removeClass(dg.getBody(), className);
};
