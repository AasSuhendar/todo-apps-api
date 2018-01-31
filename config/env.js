module.exports = {
  database_dev: process.env.MONGO_URL || 'mongodb://127.0.0.1/todo-list',
  database_test: process.env.MONGO_URL || 'mongodb://playcourt:playcourtTelkom@mongodb-for-testing-api.apps.playcourt.id:30308/test-db'
}
