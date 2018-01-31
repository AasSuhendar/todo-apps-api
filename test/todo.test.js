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
})
