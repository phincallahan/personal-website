// grunt/config/copy.js

module.exports = {
    main: {
        expand: true,
        cwd: 'src/resources',
        src: '**',
        dest: 'dist/assets'
    }
}
