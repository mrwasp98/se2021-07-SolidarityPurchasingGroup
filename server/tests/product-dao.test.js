'use strict';

// we also need our app for the correct routes
const app = require("../server.js");
const productDao = require('../product-dao');
const dayjs = require('dayjs');


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
    dateavailability: '2021-10-19',
    quantity: 6,
    status: 'delivered'
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
        const id = await productDao.insertProduct(fakeProduct1);
        const p = await productDao.getProductById(id);
        fakeProduct1.id=id;
        fakeAvailability1.productid=id;
        expect(p).toEqual(fakeProduct1);
    });

    test('Testing getDeliveredProducts function', async () => {
        //Testing wrong case
        const productid = await productDao.insertProduct(fakeProduct1);
        fakeAvailability1.productid=productid;
        await productDao.insertAvailability(fakeAvailability1);
        const result = await productDao.getDeliveredProducts(dayjs('2021-10-13 13:00'));
        expect(result.body).toEqual(undefined);
    });

});