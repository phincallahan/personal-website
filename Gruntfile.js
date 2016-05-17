module.exports = function(grunt) {
    path = require('path');

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt/config'),
        jitGrunt: {
            staticMappings: {
                gen : 'grunt/tasks/gen.js'
            } 
        }
    });
	
	grunt.registerTask('stylesheets', ['sass', 'postcss']);
    grunt.registerTask('build', ['clean', 'gen', 'stylesheets', 'browserify', 'copy']);
	grunt.registerTask('dev', ['build', 'browserSync', 'watch']);
    grunt.registerTask('default', ['build']);

}

