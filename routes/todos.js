var express = require('express')
var router = express.Router()
var ToDoList = require('../apps/controllers/ToDo-controller')

router.get('/', function (req, res) {
  ToDoList.getAllTodos(req, res)
})

router.get('/:id', function (req, res) {
  ToDoList.getTodosById(req, res)
})

router.post('/', function (req, res) {
  ToDoList.insertTodo(req, res)
})

router.put('/', function (req, res) {
  ToDoList.updateTodo(req, res)
})

router.delete('/', function (req, res) {
  ToDoList.deleteTodo(req, res)
})

module.exports = router
