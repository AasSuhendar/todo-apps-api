// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
let request = require('supertest')
let server = require('../app')

describe('Melakukan cek end point API' , () => {
  test('proses test ini seharusnya memberikan respon nilai JSON dengan pesan "Wellcome to TODO Apps API"', (done) => {
    var successResponse = {
      status: true,
      code: 'GET-MAIN-ENDPOINT',
      message: 'Wellcome to TODO Apps API'
    }
    request(server).get('/')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('message', 'Wellcome to TODO Apps API')
        expect(res.body).toHaveProperty('code', 'GET-MAIN-ENDPOINT')
        expect(res.body).toHaveProperty('status', true)
        expect(res.body).toMatchObject(successResponse)
        done()
      })
  })
})
