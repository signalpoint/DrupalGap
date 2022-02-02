dg.theme_bucket = function(vars) {

  if (!vars._grab && !vars._fill) { return; }

  // Determine the format.
  if (!vars._format) { vars._format = 'div'; }
  var format = vars._format;

  if (!vars._attributes.id) { vars._attributes.id = format + '-' + dg.salt(); }

  var id = vars._attributes.id;

  var bucket = new dg.Bucket(id, vars);
  dg.setBucket(id, bucket);

  var element = {};

  var prefix = vars._prefix ? dg.render(vars._prefix) : '';
  var suffix = vars._suffix ? dg.render(vars._suffix) : '';

  element.bucket = {
    _markup:
      prefix + '<' + format + ' ' + dg.attrs(vars) + '></' + format + '>' + suffix,
    _postRender: [function() {
        bucket.render();
    }]
  };

  return dg.render(element);

};

dg._buckets = {};
dg.Bucket = function(id, vars) {

  this._id = id;
  this._vars = vars;

  this.id = function() { return this._id; };
  this.element = function() { return dg.qs('#' + this.id()); };
  this.getVars = function() { return this._vars; };
  this.refresh = function() { this.render(); };

  this.render = function() {
    var b = this;
    var vars = this.getVars();
    var p = null;
    if (vars._grab) { p = vars._grab(); }
    else if (vars._fill) { p = new Promise(vars._fill); }
    p.then(function(content) {
      b.element().innerHTML = dg.render(content);
      if (dg.postRenderCount()) { dg.runPostRenders(); }
    });
  };

};

dg.getBuckets = function() {
  return dg._buckets;
};
dg.getBucket = function(id) {
  return dg._buckets[id] ? dg._buckets[id] : null;
};
dg.setBucket = function(id, bucket) {
  dg._buckets[id] = bucket;
};
dg.clearBuckets = function() {
  dg._buckets = {};
};
