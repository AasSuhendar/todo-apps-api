// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
let request = require('supertest')
let server = require('../app')
let Todo = require('../apps/models/ToDo')

describe('Evaluasi API todos' , () => {

  beforeEach((done) => {
    Todo.remove({}, (err) => {
      done()
    })
  })

  /*
   * Test the /GET route
   */
  describe('Meminta Sistem menampilkan seluruh daftar todos', () => {
    test('Sistem harus mengembalikan daftar todos', (done) => {
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
  describe('Membuat Todo baru', () => {
    test('Sistem menyimpan todo baru dan memberika pesan sukses "Insert new todo successfuly"', (done) => {
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

    test('Sistem gagal menyimpan todo baru karena data input tidak lengkap dan memberikan pesan gagal "Insert new todo failed"', (done) => {
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
  describe('Meminta Sistem menampilkan sebuah todo berdasarkan ID', () => {
    it('Sistem harus mengembalikan sebuah todo berdasarkan ID', (done) => {
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
  describe('Merubah Todo dengan data berbeda', () => {
    it('Sistem merubah todo dengan data berbeda dan memberikan pesan sukses "Update new todo successfuly"', (done) => {
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
  describe('Menghapus data Todo', () => {
    it('Sistem menghapus todo dan memberikan pesan sukses "Delete new todo successfuly"', (done) => {
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
