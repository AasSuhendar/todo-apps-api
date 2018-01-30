var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ToDoSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  }
})

module.exports = mongoose.model('Todos', ToDoSchema)
