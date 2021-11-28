'use strict';

// we also need our app for the correct routes
const app = require("../server.js");
const productDao = require('../product-dao');


jest.setTimeout(10000);

/*
REMEMBER
Change the database in database.js before running tests
*/

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
};
const fakeAvailability1 = {
    productid: 0,
    dateavailability: '2021-10-11',
    quantity: 6,
    status: 'si'
};

describe('Test product-dao functions unused in any api', () => {

    beforeAll(async () => {
        await productDao.deleteAllProducts();
    })

    afterEach(async () => {
        await productDao.deleteAllProducts();
    })

    afterAll(async () => {
        app.close();
    })

    test('Testing getProductById function', async () => {
        await productDao.insertProduct(fakeProduct1);
        const p = await productDao.getProductById(0);
        expect(p).toEqual(fakeProduct1);
    });

});