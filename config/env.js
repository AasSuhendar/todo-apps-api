module.exports = {
  database_dev: process.env.MONGO_URL || 'mongodb://127.0.0.1/todo-list',
  database_test: process.env.MONGO_URL || 'mongodb://aassuhendar:qwerty445@mongo-test-playcourt.apps.playcourt.id:31749/test-db',
}
