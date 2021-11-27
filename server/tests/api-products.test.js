'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const productDao = require('../product-dao');
const farmerDao = require('../farmer-dao.js');

/*
REMEMBER
Change the database in database.js before running tests
*/

const fakeProduct1 = {
    id: 0,
    name: 'Artichoke',
    description: 'Description artichoke',
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
    description: 'Description banana',
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
    description: 'Description mele',
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

const fakeFarmer1 = {
    userid: 1,
    name: 'Henry',
    surname: 'Jekyll',
    place: 'Cooperativa di Dr. Jekyll',
    address: 'Via Trotta, 3, Torino, TO'
}
const fakeFarmer2 = {
    userid: 2,
    name: 'Edward',
    surname: 'Hyde',
    place: 'Azienda Agricola di Mr. Hyde',
    address: 'Str. Val Chiapini, 70, Torino, TO'
}
const fakeFarmer3 = {
    userid: 3,
    name: 'Neil',
    surname: 'Watts',
    place: 'Sigmund Corp.',
    address: 'Via Boh, 70, Moon, MO'
}

const completeFakeProduct2 = {
    id: 1,
    name: 'Banana',
    description: 'prova description2',
    farmerid: 2,
    price: 15.00,
    measure: 'kg',
    category: 'Fruit',
    typeofproduction: 'Bio',
    picture: '',
    dateavailability: '2021-09-11',
    quantity: 12
}

describe('Testing GET on /api/products', () => {

    beforeAll(async () => {
        //clear and fill (mock) product database with fakeProduct1 and fakeProduct2
        await productDao.deleteAllProducts();
        await farmerDao.deleteAllFarmers();
        await productDao.deleteAvailability();

        await farmerDao.insertFarmer(fakeFarmer1);
        await farmerDao.insertFarmer(fakeFarmer2);
        await farmerDao.insertFarmer(fakeFarmer3);

        await productDao.insertProduct(fakeProduct1);
        await productDao.insertProduct(fakeProduct2);
        await productDao.insertProduct(fakeProduct3);

        await productDao.insertAvailability(fakeAvailability1);
        await productDao.insertAvailability(fakeAvailability2);
        await productDao.insertAvailability(fakeAvailability3);
    });

    afterAll(async () => {
        //clear (mock) product database
        await productDao.deleteAllProducts();
        await farmerDao.deleteAllFarmers();
        await productDao.deleteAvailability();

        app.close();
    });

    //remember: mock database should be pre-filled with
    //fakeProduct1 and fakeProduct2 for this method to work
    test("It should respond with an array of products", async () => {
        const response = await request(app).get('/api/products/2021-09-11');
        expect(response.body).toEqual([completeFakeProduct2]);
    });

    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get('/api/products/2021-09-11');
        expect(response.statusCode).toBe(200);
    });
   
});