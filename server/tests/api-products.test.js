'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing GET on /api/products', () => {

    /*
    const fakeProduct1 = {
            id: 0,
            name: 'Artichoke',
            farmerid: 1,
            price: 1,
            measure: 'kg',
            category: 'Vegetables',
            typeofproduction: 'Bio',
            picture: ''
        }
        const fakeProduct2 = {
            id: 1,
            name: 'Banana',
            farmerid: 2,
            price: 15.00,
            measure: 'kg',
            category: 'Fruit',
            typeofproduction: 'Bio',
            picture: ''
        }
    */

    beforeAll(() => {
        //clear and fill (mock) product database with fakeProduct1 and fakeProduct2
    });

    afterAll(() => {
        //clear (mock) product database
    });

    /*remember: mock database should be pre-filled with
    fakeProduct1 and fakeProduct2 for this method to work*/
    test("It should respond with an array of products", async () => {
        const response = await request(app).get('/api/products');
        const fakeProduct1 = {
            id: 0,
            name: 'Artichoke',
            farmerid: 1,
            price: 1,
            measure: 'kg',
            category: 'Vegetables',
            typeofproduction: 'Bio',
            picture: ''
        }
        const fakeProduct2 = {
            id: 1,
            name: 'Banana',
            farmerid: 2,
            price: 15.00,
            measure: 'kg',
            category: 'Fruit',
            typeofproduction: 'Bio',
            picture: ''
        }
        expect(response.body).toEqual([fakeProduct1, fakeProduct2]);
    });

    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(200);
    });

    //TODO tests in case of failure

});