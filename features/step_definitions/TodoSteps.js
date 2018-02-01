process.env.NODE_ENV = 'test'
const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')
// const { _ } = require('lodash')
let Todo = require('../../apps/models/ToDo')
let request = require('supertest')
let server = require('../../app')

Given('Melani memiliki pekerjaan yang harus dimasukan ke sistem dengan judul {string}',
  function (title, done) {
    this.setToDo(title)
    expect('Menyiapkan ruang rapat').to.equal(title)
    done()
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

Given('Melani ingin melihat daftar pekerjaannya yang ada di sistem', function (done) {
  done(null, 'passed')
})

When('Melani melakukan GET request ke sistem {string}', function (api, done) {
  request(server).get(api)
    .expect(200)
    .end((err, res) => {
      this.setReturnMessage(res.body.message)
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.have.property('message', 'Get list todo successfuly')
      expect(res.body).to.have.property('code', 'GET-LIST-TODO')
      expect(res.body).to.have.property('status', true)
      done()
    })
})

Then('Sistem menampilkan daftar pekerjaan tersebut dan menampilkan pesan {string}', function (string, done) {
  expect(this.getReturnMessage()).to.equal(string)
  done()
})

Given('Melani ingin menghapus pekerjaannya yang ada di sistem yang bernama {string}', function (title, callback) {
  this.setToDo(title)
  expect('Menyiapkan ruang rapat').to.equal(title)
  callback()
})

When('Melani melakukan DELETE request ke sistem {string}', function (api, callback) {
  Todo.findOne({name: this.todo}, (err, todo) => {
    request(server).delete(api + todo._id)
      .expect(200)
      .end((err, res) => {
        this.setReturnMessage(res.body.message)
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.have.property('message', 'Delete new todo successfuly')
        expect(res.body).to.have.property('code', 'DELETE-TODO')
        expect(res.body).to.have.property('status', true)
        expect(res.body.data).to.have.property('n', 1)
        expect(res.body.data).to.have.property('ok', 1)
        callback()
      })
  })
})

Then('Sistem menghapus pekerjaan tersebut dan menampilkan pesan {string}', function (string, callback) {
  expect(this.getReturnMessage()).to.equal(string)
  callback()
})
