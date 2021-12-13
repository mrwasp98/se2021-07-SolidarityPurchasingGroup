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
    productid: null,
    dateavailability: '2021-10-11',
    quantity: 6,
    status: 'si',
    price: 15.00
}
const fakeAvailability2 = {
    productid: null,
    dateavailability: '2021-09-11',
    quantity: 12,
    status: 'si',
    price: 15.00
}
const fakeAvailability3 = {
    productid: null,
    dateavailability: '2021-11-20',
    quantity: 18,
    status: 'si',
    price: 15.00
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
let productid1, productid2, productid3;

describe('Testing GET on /api/products', () => {

    beforeAll(async () => {
        //clear and fill (mock) product database with fakeProduct1 and fakeProduct2
        await productDao.deleteAllProducts();
        await farmerDao.deleteAllFarmers();
        await productDao.deleteAvailability();

        await farmerDao.insertFarmer(fakeFarmer1);
        await farmerDao.insertFarmer(fakeFarmer2);
        await farmerDao.insertFarmer(fakeFarmer3);

        productid1 = await productDao.insertProduct(fakeProduct1);
        productid2 = await productDao.insertProduct(fakeProduct2);
        productid3 = await productDao.insertProduct(fakeProduct3);

        fakeAvailability1.productid = productid1;
        fakeAvailability2.productid = productid2;
        fakeAvailability3.productid = productid3;
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
        //remove id field from result before testing equality
        const result = response.body.map((product) => ({
            name: product.name,
            description: product.description,
            farmerid: product.farmerid,
            price: product.price,
            measure: product.measure,
            category: product.category,
            typeofproduction: product.typeofproduction,
            picture: product.picture,
            dateavailability: product.dateavailability,
            quantity: product.quantity
        }));
        expect(result).toEqual([completeFakeProduct2]);
    });

    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get('/api/products/2021-09-11');
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing GET on /api/productsByFarmer', () => {

    beforeAll(async () => {
        //clear and fill (mock) product database with fakeProduct1 and fakeProduct2
        await productDao.deleteAllProducts();
        await farmerDao.deleteAllFarmers();
        await productDao.deleteAvailability();

        await farmerDao.insertFarmer(fakeFarmer1);
        await farmerDao.insertFarmer(fakeFarmer2);
        await farmerDao.insertFarmer(fakeFarmer3);

        productid1 = await productDao.insertProduct(fakeProduct1);
        productid2 = await productDao.insertProduct(fakeProduct2);
        productid3 = await productDao.insertProduct(fakeProduct3);

        fakeAvailability1.productid = productid1;
        fakeAvailability2.productid = productid2;
        fakeAvailability3.productid = productid3;
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
        const response = await request(app).get('/api/productsByFarmer/1');
        //remove id field from result before testing equality
        const result = response.body.map((product) => ({
            name: product.name,
            description: product.description,
            farmerid: product.farmerid,
            price: product.price,
            measure: product.measure,
            category: product.category,
            typeofproduction: product.typeofproduction,
            picture: product.picture,
            dateavailability: product.dateavailability,
            quantity: product.quantity
        }));
        expect(result).toEqual([fakeProduct1]);
    });

    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get('/api/productsByFarmer/1');
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing POST on /api/product', () => {

    beforeEach(async () => {
        await productDao.deleteAllProducts();
    });

    afterAll(async () => {
        //clear (mock) product database
        await productDao.deleteAllProducts();
        app.close();
    });

    test("It should respond with 200 status code", async () => {
        const response = await request(app).post('/api/product').send(fakeProduct1);
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing PUT on /api/product', () => {

    beforeAll(async () => {
        //clear and fill (mock) product database with fakeProduct1 and fakeProduct2
        await productDao.deleteAllProducts();
        await productDao.deleteAvailability();
        productid1 = await productDao.insertProduct(fakeProduct1);
    });

    afterAll(async () => {
        //clear (mock) product database
        await productDao.deleteAllProducts();
        await productDao.deleteAvailability();

        app.close();
    });

    test("It should update the product", async () => {
        const newProduct = {
            id: productid1,
            name: 'A',
            description: 'A',
            farmerid: 2,
            measure: 'A',
            category: 'A',
            typeofproduction: 'A',
            picture: ''
        }
        await request(app).put('/api/product').send(newProduct);
        const p = await productDao.getProductById(productid1);
        delete p.price;
        expect(newProduct).toEqual(p);
    });

    test("It should respond with 200 status code", async () => {
        const response = await request(app).put('/api/product').send({
            id: productid1,
            name: 'A',
            description: 'A',
            farmerid: 2,
            price: 2,
            measure: 'A',
            category: 'A',
            typeofproduction: 'A',
            picture: ''
        });
        expect(response.statusCode).toBe(200);
    });

});

describe('Testing DELETE on /api/product', () => {

    beforeEach(async () => {
        await productDao.deleteAllProducts();
        await productDao.deleteAvailability();
        productid1 = await productDao.insertProduct(fakeProduct1);
    });

    afterAll(async () => {
        await productDao.deleteAllProducts();
        await productDao.deleteAvailability();
        app.close();
    });

    test("It should delete the product", async () => {
        await request(app).delete('/api/product/' + productid1);
        const p = await productDao.getProductById(productid1);
        expect(p).toBe(undefined);
    });

    test("It should respond with 200 status code", async () => {
        const response = await request(app).delete('/api/product/' + productid1);
        expect(response.statusCode).toBe(200);
    });

});