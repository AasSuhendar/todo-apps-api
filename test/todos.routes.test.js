var chai = require('chai')
const sinon = require('sinon')
var expect =  chai.expect
const express = require('express');
const supertest = require('supertest');
const router_todo = require('../routes/todos');
const ToDoList = require('../apps/controllers/ToDo-controller');
const Todo = require('../apps/models/ToDo');
process.env.NODE_ENV = 'test'
const bodyParser = require('body-parser');


describe('Routers Todo', function () {
    describe('todo route /', function () {
        // this.timeout(5000); 
        let app, request;
        beforeEach(() => {

            // Create an express application object
            app = express();
            app.use(bodyParser.json());

            // Bind our routes to our application using the method explained earlier
            // route_index(app);
            app.use('/', router_todo)

            // Add newly created app instance to supertest object
            request = supertest(app);
        });

        afterEach(() => {

        });

        // This makes sure that we are pulling from the correct MongoDB collection
        it ('Todo exists and belongs to collection todos', () => {
            expect(Todo.model).to.exist;
            expect(Todo.collection.name).to.equal('todos');
        });

        it('Get List Todos /api/todo ', async (done) => {
    
            const returnedTodo = {
                status: true,
                code: 'GET-LIST-TODO',
                message: 'Get list todo successfuly',
                data: [{id:1, name:"todo1", status:"Backlog"}, {id:2, name:"todo2", status:"Backlog"}]
            }
    
            sinon.stub(ToDoList, 'getAllTodos').resolves(returnedTodo);
            
            request.get('/').set('Accept', 'application/json').expect(200).then(resp => {
                done();
            });
            // sinon.restore()
            done()
        });

        it('Get Todos by ID /api/todo/:id ', async (done) => {
    
            const returnedTodo = {
                status: true,
                code: 'GET-LIST-TODO',
                message: 'Get list todo successfuly',
                data: {id:1, name:"todo1", status:"Backlog"}
            }
    
            sinon.stub(ToDoList, 'getTodosById').resolves(returnedTodo);
            
            request.get('/:id').query({id:123}).set('Accept', 'application/json').expect(200).then(resp => {
                done();
            });
            // sinon.restore()
            done()
        });

        it('Post Todos by ID /api/todo/ ', async (done) => {
    
            const returnedTodo = {
                status: true,
                code: 'GET-LIST-TODO',
                message: 'Get list todo successfuly',
                data: {id:1, name:"todo1", status:"Backlog"}
            }
    
            sinon.stub(ToDoList, 'insertTodo').resolves(returnedTodo);
            
            request.post('/').send({id:1, name:"todo1", status:"Backlog"}).set('Accept', 'application/json').expect(200).then(resp => {
                done();
            });
            // sinon.restore()
            done()
        });

        it('Put Todos by ID /api/todo/:id ', async (done) => {
    
            const returnedTodo = {
                status: true,
                code: 'GET-LIST-TODO',
                message: 'Get list todo successfuly',
                data: {id:1, name:"todo1", status:"Backlog"}
            }
    
            sinon.stub(ToDoList, 'updateTodo').resolves(returnedTodo);
            
            request.put('/:id').send({id:1, name:"todo1", status:"Backlog"}).set('Accept', 'application/json').expect(200).then(resp => {
                done();
            });
            // sinon.restore()
            done()
        });

        it('Del Todos by ID /api/todo/:id ', async (done) => {
    
            const returnedTodo = {
                status: true,
                code: 'GET-LIST-TODO',
                message: 'Get list todo successfuly',
                data: {id:1, name:"todo1", status:"Backlog"}
            }
    
            sinon.stub(ToDoList, 'deleteTodo').resolves(returnedTodo);
            
            request.delete('/:id').send({id:1, name:"todo1", status:"Backlog"}).set('Accept', 'application/json').expect(200).then(resp => {
                done();
            });
            // sinon.restore()
            done()
        });
    });
});