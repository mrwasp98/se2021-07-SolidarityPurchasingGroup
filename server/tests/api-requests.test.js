'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing POST on /api/requests', () => {

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/api/requests').send({
            userid: 0,
            creationdate: '01/01/2021',
            claimdate: '01/02/2021',
            confirmationdate: '',
            deliveryaddress: 'Corso Duca degli Abruzzi, 21, Torino',
            deliveryid: 1,
            status: '',
            productid: 0,
            quantity: 2,
            price: '3,50'
        })
        expect(response.statusCode).toBe(200);
    });

    //TODO tests in case of failure

});