// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
let request = require('supertest')
let server = require('../app')
let Todo = require('../apps/models/ToDo')

describe('### Todos endpoint Testing ###' , () => {

  beforeEach((done) => {
    Todo.remove({}, (err) => {
      done()
    })
  })

  /*
   * Test the /GET route
   */
  describe('/GET Todos', () => {
    test('it should GET all todos', (done) => {
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
  describe('/POST Todos', () => {
    test('it should POST a book success with message Insert new todo successfuly', (done) => {
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

    test('it should not POST a book without description', (done) => {
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
  describe('/GET/:id Todo', () => {
    it('it should GET a todo by the given id', (done) => {
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
            expect(res.body).toHaveProperty('message', 'Get todo successfuly')
            expect(res.body).toHaveProperty('code', 'GET-TODO')
            expect(res.body).toHaveProperty('status', true)
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
  describe('/PUT/ Todo', () => {
    it('it should UPDATE a todo given the id', (done) => {
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
  describe('/DELETE/ Todo', () => {
    it('it should DELETE a todo given the id', (done) => {
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
