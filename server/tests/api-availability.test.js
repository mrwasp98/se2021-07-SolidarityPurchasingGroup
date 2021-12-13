'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const productDao = require('../product-dao');

/*
REMEMBER
Change the database in database.js before running tests
*/
const fakeProduct1 = {
    name: 'Artichoke',
    description: 'prova description1',
    farmerid: 1,
    price: 1,
    measure: 'kg',
    category: 'Vegetables',
    typeofproduction: 'Bio',
    picture: ''
}
const fakeAvailability1 = {
    productid: null,
    dateavailability: '2021-10-11',
    quantity: 6,
    status: 'si',
    price: 15.00
}
let productid;

describe('Testing POST on /api/availability', () => {

    beforeEach(async () => {
        await productDao.deleteAvailability();
        await productDao.deleteAllProducts();
        productid = await productDao.insertProduct(fakeProduct1);
        fakeAvailability1.productid=productid;
    });

    afterAll(async () => {
        await productDao.deleteAvailability();
        app.close();
    });

    test("It should respond with 200 status code", async () => {
        const response = await request(app).post('/api/availability').send(fakeAvailability1);
        expect(response.statusCode).toBe(200);
    });

});