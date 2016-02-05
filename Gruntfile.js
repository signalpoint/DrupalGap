var drupalgap_grunt_src = [

  'src/dg.js',

  'src/includes/block.inc.js',
  'src/includes/common.inc.js',
  'src/includes/entity.inc.js',

  'src/includes/form.inc.js',
  'src/includes/form-element.inc.js',
  'src/includes/form-input.inc.js',
  'src/includes/form-state.inc.js',
  'src/includes/form-widget.inc.js',

  'src/includes/field-definition.inc.js',
  'src/includes/field-form-mode.inc.js',
  'src/includes/field-formatter.inc.js',
  'src/includes/field-item-list-interface.inc.js',
  'src/includes/field-widget.inc.js',

  'src/includes/go.inc.js',
  'src/includes/messages.inc.js',
  'src/includes/module.inc.js',
  'src/includes/region.inc.js',
  'src/includes/render.inc.js',
  'src/includes/rest.inc.js',
  'src/includes/router.inc.js',
  'src/includes/theme.inc.js',
  'src/includes/user.inc.js',
  'src/includes/views.inc.js',
  'src/includes/widgets.inc.js',

  'src/modules/admin/admin.js',
  'src/modules/core/core.js',
  'src/modules/core/core.field-formatters.js',
  'src/modules/core/core.field-widgets.js',
  'src/modules/core/core.form-widgets.js',
  'src/modules/core/core.theme.js',
  'src/modules/image/image.js',
  'src/modules/image/image.field-formatters.js',
  'src/modules/node/node.js',
  'src/modules/node/node.forms.js',
  'src/modules/system/system.js',
  'src/modules/text/text.js',
  'src/modules/text/text.field-formatters.js',
  'src/modules/text/text.field-widgets.js',
  'src/modules/user/user.js',
  'src/modules/user/user.forms.js'

];

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        separator: '\n'
      },
      dist: {
        src: drupalgap_grunt_src,
        dest: '<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: drupalgap_grunt_src,
        dest: '<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: drupalgap_grunt_src,
      tasks: ['concat', 'uglify'] // @see http://stackoverflow.com/a/20740693/763010
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};
