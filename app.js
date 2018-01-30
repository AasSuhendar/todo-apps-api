var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Promise = require('bluebird')
var env = require('./config/env')

var index = require('./routes/index')
var todos = require('./routes/todos')

var app = express()

Promise.promisifyAll(mongoose)
mongoose.Promise = global.Promise

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(env.database_test)
  mongoose.connection.on('connected', function () {})
} else {
  mongoose.connect(env.database_dev)
  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to (dev) :' + env.database_dev)
  })
  app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', index)
app.use('/api/todo-list', todos)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({
    status: false,
    code: 'NOT-FOUND',
    message: 'Endpoint notfound'
  })
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
