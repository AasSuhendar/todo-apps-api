var express = require('express')
var router = express.Router()
var ToDoList = require('../apps/controllers/ToDo-controller')

router.get('/', function (req, res) {
  ToDoList.getAllTodos(req,res)
})

router.post('/', function (req, res) {
  ToDoList.insertTodo(req,res)
})

module.exports = router
