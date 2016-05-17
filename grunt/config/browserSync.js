// grunt/config/browserSync.js

module.exports = {
    dev: {
        bsFiles: {
            src: ['dist/assets/**/*', 'src/views/*.jade']
        }, 

        options: {
            proxy: 'localhost:3000',
            watchTask: true
        }
    }
}
