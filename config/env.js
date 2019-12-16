module.exports = {
  database_dev: process.env.MONGO_URL || 'mongodb://127.0.0.1/todo-list',
  // database_test: process.env.MONGO_URL || 'mongodb://127.0.0.1/todo-list-test',
  // db test to mongodb in openshift
  database_test: process.env.MONGO_URL || 'mongodb://127.0.0.1/todo-list'
}
