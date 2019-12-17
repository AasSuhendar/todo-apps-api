module.exports = {
  database_dev: process.env.MONGO_URL || 'mongodb://user:password@localhost:27017/todos',
  // db test to mongodb in openshift
  database_test: process.env.MONGO_URL || 'mongodb://user:password@localhost:27017/todos'
}
