var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

var exampleModuleSrc = [
  './src/_example.js',
  './src/classes/class.*.js',
  './src/blocks/blocks.*.js',
  './src/forms/form.*.js',
  './src/includes/include.*.js',
  './src/pages/page.*.js',
  './src/widgets/widget.*.js'
];

// Task to build the cw_app.min.js file.
gulp.task('minifyJS', function(){
  return gulp.src(exampleModuleSrc)
      .pipe(gp_concat('concat.js'))
      .pipe(gulp.dest(''))
      .pipe(gp_rename('example.min.js'))
      .pipe(gp_uglify())
      .pipe(gulp.dest(''));
});

gulp.task('default', function () {
  watch(exampleModuleSrc, function(event) { gulp.start('minifyJS') });
  gulp.start('minifyJS');
});
