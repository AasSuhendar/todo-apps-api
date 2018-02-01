process.env.NODE_ENV = 'test'
const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')
// const { _ } = require('lodash')
let request = require('supertest')
let server = require('../../app')

Given('Melani memiliki pekerjaan yang harus dimasukan ke sistem dengan judul {string}',
  function (title) {
    this.setToDo(title)
    expect('Menyiapkan ruang rapat').to.equal(title)
  })

When('Melani memasukan pekerjaan:', function (newTodo, done) {
  this.todo = JSON.parse(newTodo)
  request(server).post('/api/todo-list')
    .send(this.todo)
    .expect(200)
    .end((err, res) => {
      this.setReturnMessage(res.body.message)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.have.property('message', 'Insert new todo successfuly')
      expect(res.body).to.have.property('code', 'INSERT-TODO')
      expect(res.body).to.have.property('status', true)
      expect(res.body.data).to.have.property('name', this.todo.name)
      expect(res.body.data).to.have.property('description', this.todo.description)
      expect(res.body.data).to.have.property('status', this.todo.status)
      done()
    })
})

Then('Sistem menyimpan pekerjaan tersebut dan menampilkan pesan {string}', function (message) {
  expect(this.getReturnMessage()).to.equal(message)
})
