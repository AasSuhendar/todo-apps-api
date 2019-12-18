module.exports = [{
    script: 'bin/www',
    name: 'todo-app',
    exec_mode: 'cluster',
    instances: process.env.PM2_INSTANCE || 1,
    max_memory_restart: process.env.PM2_MAX_MEM_RESTART || "90M"
}]