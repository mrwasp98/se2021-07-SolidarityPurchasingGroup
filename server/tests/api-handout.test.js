'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing PUT on /api/handout', () => {

    test('It should respond with 200 status code', async () => {
        const response = await request(app).put('/api/clients').send({
            requestId : 0
        })
        expect(response.statusCode).toBe(200);
    });

    //TODO tests in case of failure

});