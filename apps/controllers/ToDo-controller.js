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
      } else {
        res.status(200).json({
          status: true,
          code: 'GET-LIST-TODO',
          message: 'Get list todo successfuly',
          data: todos
        })
      }
    })
  },
  getTodosById: (req, res) => {
    ToDo.findById(req.params.id, (err, todos) => {
      if (err) {
        res.status(500).json({
          status: false,
          code: 'GET-TODO',
          message: 'Get todo failed',
          error: err
        })
      } else {
        res.status(200).json({
          status: true,
          code: 'GET-TODO',
          message: 'Get todo successfuly',
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
      } else {
        res.status(200).json({
          status: true,
          code: 'INSERT-TODO',
          message: 'Insert new todo successfuly',
          data: todo
        })
      }
    })
  },
  updateTodo: (req, res) => {
    ToDo.findByIdAndUpdate(req.body._id, {
      $set: {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
      }
    }, {new: true}, (err, todo) => {
      if (err) {
        res.status(500).json({
          status: false,
          code: 'UPDATE-TODO',
          message: 'Update new todo failed',
          error: err
        })
      } else {
        res.status(200).json({
          status: true,
          code: 'UPDATE-TODO',
          message: 'Update new todo successfuly',
          data: todo
        })
      }
    })
  },
  deleteTodo: (req, res) => {
    ToDo.remove({_id: req.body._id}, (err, todo) => {
      if (err) {
        res.status(500).json({
          status: false,
          code: 'DELETE-TODO',
          message: 'Delete new todo failed',
          error: err
        })
      } else {
        res.status(200).json({
          status: true,
          code: 'DELETE-TODO',
          message: 'Delete new todo successfuly',
          data: todo
        })
      }
    })
  }
}
