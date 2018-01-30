var ToDo = require('../models/ToDo')

module.exports = {
  getAllTodos: (req, res) => {
    ToDo.find({}, (err, todos) => {
      if (err) {
        res.status(500).json({
          status: false,
          code: 'GET-LIST-TODO',
          message: 'Get list todo failed',
          error: err
        })
      }else {
        res.status(200).json({
          status: true,
          code: 'GET-LIST-TODO',
          message: 'Get list todo successfuly',
          data: todos
        })
      }
    })
  },
  insertTodo: (req, res) => {
    var todo = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status
    }
    var newTodo = new ToDo(todo)
    newTodo.save((err, todo) => {
      if (err) {
        res.status(500).json({
          status: false,
          code: 'INSERT-TODO',
          message: 'Insert new todo failed',
          error: err
        })
      }else {
        res.status(200).json({
          status: true,
          code: 'INSERT-TODO',
          message: 'Insert new todo successfuly',
          data: todo
        })
      }
    })
  }
}
