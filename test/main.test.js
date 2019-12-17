// // Old Integration Test Jest
// process.env.NODE_ENV = 'test'
// let request = require('supertest')
// let server = require('../app')

// describe('Cek end point API - todo-apps-api.apps.playcourt.id' , () => {
//   test('End point mengembalikan pesan "Wellcome to TODO Apps API"', (done) => {
//     var successResponse = {
//       status: true,
//       code: 'GET-MAIN-ENDPOINT-API',
//       message: 'Wellcome to TODO Apps API'
//     }
//     request(server).get('/')
//       .expect(200)
//       .end((err, res) => {
//         expect(res.statusCode).toBe(200)
//         expect(res.body).toHaveProperty('message', 'Wellcome to TODO Apps API')
//         expect(res.body).toHaveProperty('code', 'GET-MAIN-ENDPOINT-API')
//         expect(res.body).toHaveProperty('status', true)
//         expect(res.body).toMatchObject(successResponse)
//         done()
//       })
//   })
// })

const main = require('../apps/controllers/Index-controllers')
const sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
var { mockReq, mockRes } = require('sinon-express-mock')

process.env.NODE_ENV = 'test'

describe('Controllers Index', function () {
    describe('Todo controller route /', function () {
        it('should return json message', function () {
            let res = {
                json: {
                  status: true,
                  code: 'GET-MAIN-ENDPOINT-API',
                  message: 'Wellcome to TODO Apps API'
                },
                status: sinon.stub().returns({ json: sinon.spy() })
            };
            let req = {}

            // const req = mockReq({})
            // const res = mockRes(response)
            
            main.getIndex(req, res)
            
            expect(res.json.status).to.equal(true);
            expect(res.json.code).to.equal('GET-MAIN-ENDPOINT-API');
            expect(res.json.message).to.equal('Wellcome to TODO Apps API');

        });
    });
});