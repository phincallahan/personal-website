module.exports = {
    apps: [{
        name: "personal-website",
        script: "./build/server.js",
        watch: true,
        node_args: [],
        env: {
            "NODE_ENV": "development",
        },
        env_production: {
            "NODE_ENV": "production"
        }
    }]
}