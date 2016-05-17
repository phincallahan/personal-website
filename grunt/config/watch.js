// grunt/config/watch.js

module.exports = {
    js: {
        files: 'src/js/*.js',
        tasks: ['browserify']
    },

    sass: {
        files: 'src/scss/*.scss',
        tasks: ['stylesheets']
    },	
                                   
    html: {
        files: 'src/views/*.html',
        tasks: ['build']
    }
}
