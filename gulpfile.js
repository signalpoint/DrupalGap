var minify = true;

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

var moduleSrc = [

  './src/*.js',

  './src/includes/proxies.inc.js',
  './src/includes/block.inc.js',
  './src/includes/common.inc.js',
  './src/includes/entity.inc.js',

  './src/includes/forms/form.inc.js',
  './src/includes/forms/form-*.inc.js',
  './src/includes/forms/elements/element.*.js',

  './src/includes/field-definition.inc.js',
  './src/includes/field-form-mode.inc.js',
  './src/includes/field-formatter.inc.js',
  './src/includes/field-item-list-interface.inc.js',
  './src/includes/field-widget.inc.js',

  './src/includes/dom.inc.js',
  './src/includes/go.inc.js',
  './src/includes/libraries.inc.js',
  './src/includes/messages.inc.js',
  './src/includes/module.inc.js',
  './src/includes/region.inc.js',
  './src/includes/render.inc.js',
  './src/includes/rest.inc.js',
  './src/includes/router.inc.js',
  './src/includes/theme.inc.js',
  './src/includes/user.inc.js',
  './src/includes/views.inc.js',

  './src/modules/admin/admin.js',
  './src/modules/core/core.js',
  './src/modules/core/core.field-formatters.js',
  './src/modules/core/core.field-widgets.js',
  './src/modules/core/core.form-widgets.js',
  './src/modules/core/core.theme.js',
  './src/modules/image/image.js',
  './src/modules/image/image.field-formatters.js',
  './src/modules/node/node.js',
  './src/modules/node/node.forms.js',
  './src/modules/system/*.js',
  './src/modules/system/blocks/block.*.js',
  './src/modules/text/text.js',
  './src/modules/text/text.field-formatters.js',
  './src/modules/text/text.field-widgets.js',
  './src/modules/user/user.js',
  './src/modules/user/user.forms.js',

  './src/widgets/widget.*.js'

];

// Minify JavaScript
function minifyJs() {
  console.log('compressing drupalgap.js...');
  var moduleJs = gulp.src(moduleSrc)
      .pipe(gp_concat('drupalgap.js'))
      .pipe(gulp.dest('./'));
  if (minify) {
    console.log('compressing drupalgap.min.js...');
    return moduleJs.pipe(gp_rename('drupalgap.min.js'))
      .pipe(gp_uglify())
      .pipe(gulp.dest('./'));
  }
  return moduleJs;
}
gulp.task(minifyJs);

gulp.task('default', function(done) {

  gulp.watch(moduleSrc, gulp.series('minifyJs'));

  done();

});
