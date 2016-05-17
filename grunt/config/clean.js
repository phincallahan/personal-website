// grunt/config/clean.js

module.exports = {
    default: {
        options: {
            force: true
        },
        js: ["dist/assets/js/*.js"],
        css: ["dist/assets/css/*.css"],
        posts: ["dist/posts/**"]
    }
}
