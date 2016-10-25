var path = require('path');

module.exports = function (grunt) {
  grunt.file.defaultEncoding = 'utf-8';

  require('load-grunt-config')(grunt, {
    init           : true,
    configPath     : path.join(process.cwd(), './.grunt'),
    loadGruntTasks : {
      config : require('./package.json'),
      scope  : 'devDependencies'
    }
  });

  grunt.registerTask('default', ['dev']);

  grunt.registerTask('dev', [
    'build',
    'watch'
  ]);

  grunt.registerTask('build', [
    'ngtemplates',
    'concat'
  ]);
};
