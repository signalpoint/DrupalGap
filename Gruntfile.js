var drupalgap_grunt_src = ['src/*.js', 'src/includes/*.inc.js', 'src/modules/*/*.js'];

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        /*separator: ';',*/
      },
      dist: {
        src: drupalgap_grunt_src,
        dest: 'bin/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: drupalgap_grunt_src,
        dest: 'bin/<%= pkg.name %>.min.js'
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
