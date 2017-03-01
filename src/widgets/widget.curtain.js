dg._curtains = {};

/**
 *
 * @param variables
 *  _open {String|Function|Promise}
 * @returns {string}
 */
dg.theme_curtain = function(variables) {

  // @TODO make this splittable in case the button and the container need to be separate

  // @TODO the click handler may not need to be that complex, maybe folks can just
  // place a bucket in the fill (probably need to run a post render).

  // @TODO the global curtain container needs to be purged during page transitions

  if (!variables._attributes.id) { variables._attributes.id = dg.userPassword(); }
  var id = variables._attributes.id;
  var format = variables._format ? variables._format : 'div';

  // Create the open button.
  var openOptions = variables._open ? variables._open : {};
  var openBtn = openOptions.button ? openOptions.button : {};
  if (!openBtn._attributes.onclick) { openBtn._attributes.onclick = "dg._curtainClick(this, 'open')"; }
  if (!openBtn._attributes.for) { openBtn._attributes.for = id; }

  // Set the curtain aside.
  dg._curtains[id] = variables;
  var curtain = dg._curtains[id];

  // Render the button and the container, then return them.
  var btn = dg._curtainBtnWrapOpen(curtain) +
      dg._curtainButtonRender(openBtn, curtain, 'open') +
      dg._curtainBtnWrapClose(curtain);
  var container = '<' + format + ' ' + dg.attributes(variables._attributes) + '></' + format + '>';
  return btn + container;
};
dg._curtainBtnWrapOpen = function(curtain) {
  var btnWrapper = curtain._button_wrapper ? curtain._button_wrapper : {};
  dg.elementAttributesInit(btnWrapper);
  if (!btnWrapper._format) { btnWrapper._format = 'div'; }
  btnWrapper._attributes.id = 'curtain-btn-wrapper-' + curtain._attributes.id;
  curtain._button_wrapper = btnWrapper;
  return '<' + btnWrapper._format + ' ' + dg.attributes(btnWrapper._attributes) + '>'
};
dg._curtainBtnWrapClose = function(curtain) {
  return '</' + curtain._button_wrapper._format + '>'
};
dg._curtainButtonRender = function(btn, curtain, direction) {
  var btnType = btn._type ? btn._type : 'link'; // or 'button'
  var btnText = btn._text ? btn._text : direction == 'open' ? '+' : '-';
  return btnType == 'link' ? dg.l(btnText, null, btn) : dg.b(btnText, btn);
};
dg._curtainClick = function(button, direction) {

  // Grab the curtain id and load the curtain.
  var id = button.getAttribute('for');
  var curtain = dg._curtains[id];

  var op = direction == 'open' ? 'close' : 'open';
  var opKey = '_' + direction;
  var btnKey = '_' + op;

  // Run before handler, if any.
  if (curtain[opKey].before) { curtain[opKey].before(button, curtain); }

  // Create the button.
  var btnOptions = curtain[btnKey] ? curtain[btnKey] : {};
  var btn = btnOptions.button ? btnOptions.button : {};
  if (!btn._attributes.onclick) { btn._attributes.onclick = "dg._curtainClick(this, '" + op + "')"; }
  if (!btn._attributes.for) { btn._attributes.for = id; }

  // Swap the button.
  document.getElementById('curtain-btn-wrapper-' + id).innerHTML =
      dg._curtainButtonRender(btn, curtain, op);

  // Fill the content and run any post renders.
  document.getElementById(id).innerHTML = direction == 'open' ?
      dg.render(curtain._fill()) : '';
  dg.runPostRenders();

  // Run after handler, if any.
  if (curtain[opKey].after) { curtain[opKey].after(button, curtain); }

};
