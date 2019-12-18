var ToDo = require('../models/ToDo')

let getAllTodos = async (req,res) => {
  ToDo.find({}, (err, todos) => {
    if (err) {
      return res.status(500).json({
        status: false,
        code: 'GET-LIST-TODO',
        message: 'Get list todo failed',
        error: err
      })
    } else {
      return res.status(200).json({
        status: true,
        code: 'GET-LIST-TODO',
        message: 'Get list todo successfuly',
        data: todos
      })
    }
  })
}

let getTodosById =  async (req, res) => {
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
}

let insertTodo = async (req,res) => {
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
}

let updateTodo = async (req,res) => {
  ToDo.findByIdAndUpdate(req.params.id, {
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
}

let deleteTodo = async (req,res) => {
  ToDo.remove({_id: req.params.id}, (err, todo) => {
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

module.exports = {
  getAllTodos,
  getTodosById,
  insertTodo,
  updateTodo,
  deleteTodo
}
