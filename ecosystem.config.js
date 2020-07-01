module.exports = {
    apps: [{
        name: "todo-api",
        script: "index.js",
        env: {
            NODE_ENV: "development",
            PORT: 8282
        },
        env_production: {
            NODE_ENV: "production",
            PORT: 8282
        },
        instances: 1,
        exec_mode: "fork"
    }]
}