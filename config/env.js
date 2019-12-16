module.exports = {
  database_dev: process.env.MONGO_URL || 'mongodb://127.0.0.1/todo-list',
  // db test to mongodb in openshift
  database_test: process.env.MONGO_URL || 'mongodb://127.0.0.1/todo-list'
}
