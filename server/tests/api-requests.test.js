'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const productDao = require('../product-dao');
const orderDao = require('../order-dao');
const orderLineDao = require('../orderline-dao');

/*
TODO
Maybe this should be merged with /api/orders, because we are adding an order, not a request
*/

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing POST on /api/requests', () => {

    const fakeProduct1 = {
        id: 0,
        name: 'Artichoke',
        description: 'prova description1',
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
        description: 'prova description2',
        farmerid: 2,
        price: 15.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeProduct3 = {
        id: 2,
        name: 'Mele',
        description: 'prova description3',
        farmerid: 3,
        price: 11.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    }


    const fakeAvailability1 = {
        productid: 0,
        dateavailability: '2021-10-11',
        quantity: 6,
        status: 'si'
    }
        const fakeAvailability2 = {
        productid: 1,
        dateavailability: '2021-09-11',
        quantity: 12,
        status: 'si'
    }
    const fakeAvailability3 = {
        productid: 2,
        dateavailability: '2021-11-20',
        quantity: 18,
        status: 'si'
    }

    beforeAll(async() => {
        //clear and fill (mock) product database with fakeProduct1 and fakeProduct2
        await productDao.deleteAllProducts();

        await productDao.deleteAvailability();

        await productDao.insertProduct(fakeProduct1);
        await productDao.insertProduct(fakeProduct2);
        await productDao.insertProduct(fakeProduct3);

        await productDao.insertAvailability(fakeAvailability1);
        await productDao.insertAvailability(fakeAvailability2);
        await productDao.insertAvailability(fakeAvailability3);

        await orderDao.deleteAllOrders();
        await orderLineDao.deleteAllOrderlines();


    });
    
    afterAll(async() => {
        //clear (mock) product database
        await productDao.deleteAllProducts();
        await productDao.deleteAvailability();
        await orderDao.deleteAllOrders();
        await orderLineDao.deleteAllOrderlines();

        app.close(); //without that, jest won't exit
    });

    test('It should respond with 406 status code', async () => {
        const response = await request(app).post('/api/requests').send({
            id: 1,
            userid: 4,
            creationdate: "2021-11-09",
            claimdate: "2021-11-10 12:30",
            confirmationdate: "2021-11-09",
            deliveryaddress: null,
            deliveryid: null,
            status: "confirmed",
            products: [{
                id: 1,
                name: 'Banana',
                quantity: 3,
                measure: "kg",
                price: 12.10
            }, {
                id: 2,
                name: 'Mele',
                quantity: 2,
                measure: "kg",
                price: 20.11
            }]
        })
        expect(response.statusCode).toBe(406);
    });

});

