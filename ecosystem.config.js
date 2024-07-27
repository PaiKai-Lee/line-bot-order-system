module.exports = {
  apps: [{
    name: "line-bot-app",
    script: "./dist/index.js",
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
