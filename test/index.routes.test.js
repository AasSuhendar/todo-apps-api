var chai = require('chai')
var expect =  chai.expect
const express = require('express');
const supertest = require('supertest');
const route_index = require('../routes/index');
process.env.NODE_ENV = 'test'
const bodyParser = require('body-parser');


describe('Routers Index', function () {
    describe('index route /', function () {

        let app, request;
        beforeEach(() => {

            // Create an express application object
            app = express();
            app.use(bodyParser.json());

            // Bind our routes to our application using the method explained earlier
            // route_index(app);
            app.use('/', route_index)

            // Add newly created app instance to supertest object
            request = supertest(app);
        });

        afterEach(() => {

        });

        it('Base route works', function (done) {
            request
            .get('/')
            .expect('Content-Type', 'application/json')
            .expect(200, (err, res) => {
                expect(res.body.code).to.equal('GET-MAIN-ENDPOINT-API');
                expect(res.body.message).to.equal('Wellcome to TODO Apps API');
                done();
            });

        });
    });
});