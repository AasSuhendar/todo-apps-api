// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
let request = require('supertest')
let server = require('../app')
let Todo = require('../apps/models/ToDo')

describe('Melakukan cek end point API todos - todo-apps-api.apps.playcourt.id/api/todo-list' , () => {

  beforeEach((done) => {
    Todo.remove({}, (err) => {
      done()
    })
  })

  /*
   * Test the /GET route
   */
  describe('Melakukan cek GET end point API todos - todo-apps-api.apps.playcourt.id/api/todo-list', () => {
    test('Proses test ini melakukan call API GET todo-apps-api.apps.playcourt.id/api/todo-list dan seharusnya memberikan respon nilai JSON dengan kumpulan data todo list', (done) => {
      request(server).get('/api/todo-list')
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(res.body).toHaveProperty('message', 'Get list todo successfuly')
          expect(res.body).toHaveProperty('code', 'GET-LIST-TODO')
          expect(res.body).toHaveProperty('status', true)
          expect(res.body.data).toHaveLength(0)
          done()
        })
    })
  })

  /*
   * Test the /POST route
   */
  describe('Melakukan cek POST end point API todos - todo-apps-api.apps.playcourt.id/api/todo-list', () => {
    test('Proses test ini melakukan call API POST todo-apps-api.apps.playcourt.id/api/todo-list dengan memberikan sebuah data todo list baru dan seharusnya memberikan respon nilai JSON data todo list yang di inputkan dengan pesan "Insert new todo successfuly"', (done) => {
      let todo = {
        name: 'Todo 1',
        description: 'Todo 1 descriptions bla bla',
        status: 'Next task'
      }
      request(server).post('/api/todo-list')
        .send(todo)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(res.body).toHaveProperty('message', 'Insert new todo successfuly')
          expect(res.body).toHaveProperty('code', 'INSERT-TODO')
          expect(res.body).toHaveProperty('status', true)
          expect(res.body.data).toHaveProperty('name', todo.name)
          expect(res.body.data).toHaveProperty('description', todo.description)
          expect(res.body.data).toHaveProperty('status', todo.status)
          done()
        })
    })

    test('Proses test ini melakukan call API POST todo-apps-api.apps.playcourt.id/api/todo-list dengan memberikan sebuah data todo list yang tidak lengkap dan seharusnya memberikan respon nilai JSON dengan pesan "Insert new todo failed"', (done) => {
      let todo = {
        name: 'Todo 2',
        status: 'Next task'
      }
      request(server).post('/api/todo-list')
        .send(todo)
        .expect(500)
        .end((err, res) => {
          expect(res.statusCode).toBe(500)
          expect(res.body).toHaveProperty('message', 'Insert new todo failed')
          expect(res.body).toHaveProperty('code', 'INSERT-TODO')
          expect(res.body).toHaveProperty('status', false)
          done()
        })
    })
  })

  /*
   * Test the /GET/:id route
   */
  describe('Melakukan cek GET end point API todos - todo-apps-api.apps.playcourt.id/api/todo-list/:id', () => {
    it('Proses test ini melakukan call API GET todo-apps-api.apps.playcourt.id/api/todo-list/:id dan seharusnya memberikan respon nilai JSON dengan data todo list sesuai ID yang diinputkan', (done) => {
      let todoItem = {
        name: 'Todo 1',
        description: 'Todo 1 descriptions bla bla',
        status: 'Next task'
      }
      let newTodo = new Todo(todoItem)
      newTodo.save((err, todo) => {
        request(server).get('/api/todo-list/' + todo._id)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status', 1)
            expect(res.body.data).toHaveProperty('name', todo.name)
            expect(res.body.data).toHaveProperty('description', todo.description)
            expect(res.body.data).toHaveProperty('status', todo.status)
            done()
          })
      })
    })
  })

  /*
   * Test the /PUT/ route
   */
  describe('Melakukan cek PUT end point API todos - todo-apps-api.apps.playcourt.id/api/todo-list/:id', () => {
    it('Proses test ini melakukan call API PUT todo-apps-api.apps.playcourt.id/api/todo-list/:id dengan memberikan sebuah data id todo list dan data todo list baru yang akan di update dan seharusnya berhasil melakukan update data dan memberikan respon nilai JSON dengan pesan "Update new todo successfuly"', (done) => {
      let todoItem = {
        name: 'Todo 1',
        description: 'Todo 1 descriptions bla bla',
        status: 'Next task'
      }
      let updateTodoItem = {
        name: 'Todo 1',
        description: 'Todo 1 descriptions bli bli',
        status: 'Done'
      }
      let newTodo = new Todo(todoItem)
      newTodo.save((err, todo) => {
        request(server).put('/api/todo-list/' + todo.id)
          .send(updateTodoItem)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('message', 'Update new todo successfuly')
            expect(res.body).toHaveProperty('code', 'UPDATE-TODO')
            expect(res.body).toHaveProperty('status', true)
            expect(res.body.data).toHaveProperty('name', updateTodoItem.name)
            expect(res.body.data).toHaveProperty('description', updateTodoItem.description)
            expect(res.body.data).toHaveProperty('status', updateTodoItem.status)
            done()
          })
      })
    })
  })

  /*
   * Test the /PUT/ route
   */
  describe('Melakukan cek DELETE end point API todos - todo-apps-api.apps.playcourt.id/api/todo-list/:id', () => {
    it('Proses test ini melakukan call API DELETE todo-apps-api.apps.playcourt.id/api/todo-list/:id dengan memberikan sebuah data id todo list yang akan di hapus dan seharusnya berhasil melakukan delete data dan memberikan respon nilai JSON dengan pesan "Delete new todo successfuly"', (done) => {
      let todoItem = {
        name: 'Todo 1',
        description: 'Todo 1 descriptions bla bla',
        status: 'Next task'
      }
      let newTodo = new Todo(todoItem)
      newTodo.save((err, todo) => {
        request(server).delete('/api/todo-list/' + todo.id)
          .send(todoItem)
          .expect(200)
          .end((err, res) => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('message', 'Delete new todo successfuly')
            expect(res.body).toHaveProperty('code', 'DELETE-TODO')
            expect(res.body).toHaveProperty('status', true)
            expect(res.body.data).toHaveProperty('n', 1)
            expect(res.body.data).toHaveProperty('ok', 1)
            done()
          })
      })
    })
  })
})
