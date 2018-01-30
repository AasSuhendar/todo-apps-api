var express = require('express')
var router = express.Router()
var ToDoList = require('../apps/controllers/ToDo-controller')

router.get('/', function (req, res, next) {
  res.send(ToDoList.getAllTodos(req))
})

module.exports = router
