'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const productDao = require('../product-dao');
const orderDao = require('../order-dao');
const orderlineDao = require('../orderline-dao');
const farmerDao = require('../farmer-dao');

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing GET on /api/manager/weeklyReport/:date', () => {

    const fakeProduct1 = {
        name: 'Artichoke',
        description: 'prova description1',
        farmerid: 1, //Henry Jekill
        price: 1,
        measure: 'kg',
        category: 'Vegetables',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeProduct2 = {
        name: 'Banana',
        description: 'prova description2',
        farmerid: 1, //Henry Jekill
        price: 15.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeProduct3 = {
        name: 'Mela',
        description: 'prova description3',
        farmerid: 0, //Edward Hyde
        price: 11.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeFarmer1 = {
        userid: 1,
        name: 'Henry',
        surname: 'Jekyll',
        place: 'Cooperativa di Dr. Jekyll',
        address: 'Via Trotta, 3, Torino, TO'
    }
    const fakeFarmer2 = {
        userid: 0,
        name: 'Edward',
        surname: 'Hyde',
        place: 'Azienda Agricola di Mr. Hyde',
        address: 'Str. Val Chiapini, 70, Torino, TO'
    }
    const fakeOrder1 = {
        userid: 1,
        creationdate: '2021-12-04 10:00',
        claimdate: '2021-12-23 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'unretrieved'
    };
    const fakeOrder2 = {
        userid: 1,
        creationdate: '2021-12-05 21:00',
        claimdate: '2021-12-23 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'unretrieved'
    };
    //wrong status
    const fakeOrder3 = {
        userid: 1,
        creationdate: '2021-12-07 21:00',
        claimdate: '2021-12-23 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'confirmed'
    };
    //wrong date
    const fakeOrder4 = {
        userid: 1,
        creationdate: '2021-12-07 21:00',
        claimdate: '2021-12-11 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'unretrieved'
    };

    //order1 product1
    const fakeOrderline11 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order1 product2
    const fakeOrderline12 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order2 product2
    const fakeOrderline22 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order3 product3
    const fakeOrderline33 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order4 product3
    const fakeOrderline43 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };

    let productid1, productid2, productid3;


    beforeAll(async () => {
        await farmerDao.deleteAllFarmers();
        await farmerDao.insertFarmer(fakeFarmer1);
        await farmerDao.insertFarmer(fakeFarmer2);
        await productDao.deleteAllProducts();
        productid1 = await productDao.insertProduct(fakeProduct1);
        productid2 = await productDao.insertProduct(fakeProduct2);
        productid3 = await productDao.insertProduct(fakeProduct3);
        await orderDao.deleteAllOrders();
        const orderid1 = await orderDao.insertOrder(fakeOrder1);
        const orderid2 = await orderDao.insertOrder(fakeOrder2);
        const orderid3 = await orderDao.insertOrder(fakeOrder3);
        const orderid4 = await orderDao.insertOrder(fakeOrder4);
        fakeOrderline11.orderid = orderid1;
        fakeOrderline12.orderid = orderid1;
        fakeOrderline22.orderid = orderid2;
        fakeOrderline33.orderid = orderid3;
        fakeOrderline43.orderid = orderid4;
        fakeOrderline11.productid = productid1;
        fakeOrderline12.productid = productid2;
        fakeOrderline22.productid = productid2;
        fakeOrderline33.productid = productid3;
        fakeOrderline43.productid = productid3;
        await orderlineDao.deleteAllOrderlines();
        await orderlineDao.insertOrderLine(fakeOrderline11);
        await orderlineDao.insertOrderLine(fakeOrderline12);
        await orderlineDao.insertOrderLine(fakeOrderline22);
        await orderlineDao.insertOrderLine(fakeOrderline33);
        await orderlineDao.insertOrderLine(fakeOrderline43);
    });

    afterAll(async () => {
        await farmerDao.deleteAllFarmers();
        await orderDao.deleteAllOrders();
        await productDao.deleteAllProducts();
        await orderlineDao.deleteAllOrderlines();
        app.close();
    });

    test("Checking date = Saturday", async () => {
        const expectedResult = [
            {
                productid: productid1,
                name: fakeProduct1.name,
                quantity: fakeOrderline11.quantity,
                measure: fakeProduct1.measure,
                farmerName: fakeFarmer1.name,
                farmerSurname: fakeFarmer1.surname
            },
            {
                productid: productid2,
                name: fakeProduct2.name,
                quantity: fakeOrderline12.quantity + fakeOrderline22.quantity,
                measure: fakeProduct1.measure,
                farmerName: fakeFarmer1.name,
                farmerSurname: fakeFarmer1.surname
            }
        ]
        const response = await request(app).get('/api/manager/weeklyReport/2021-12-25 21:00');
        expect(response.body).toEqual(expectedResult);
    });

    test("Checking date = Tuesday", async () => {
        const expectedResult = [
            {
                productid: productid1,
                name: fakeProduct1.name,
                quantity: fakeOrderline11.quantity,
                measure: fakeProduct1.measure,
                farmerName: fakeFarmer1.name,
                farmerSurname: fakeFarmer1.surname
            },
            {
                productid: productid2,
                name: fakeProduct2.name,
                quantity: fakeOrderline12.quantity + fakeOrderline22.quantity,
                measure: fakeProduct1.measure,
                farmerName: fakeFarmer1.name,
                farmerSurname: fakeFarmer1.surname
            }
        ]
        const response = await request(app).get('/api/manager/weeklyReport/2021-12-28 21:00');
        expect(response.body).toEqual(expectedResult);
    });

    test("It should respond with 200 OK code", async () => {
        const response = await request(app).get('/api/manager/weeklyReport/2021-12-25 21:00');
        expect(response.status).toBe(200);
    });

});

describe('Testing GET on /api/manager/monthlyReport/:date', () => {

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
        farmerid: 1,
        price: 15.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeProduct3 = {
        name: 'Mela',
        description: 'prova description3',
        farmerid: 0,
        price: 11.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeFarmer1 = {
        userid: 1,
        name: 'Henry',
        surname: 'Jekyll',
        place: 'Cooperativa di Dr. Jekyll',
        address: 'Via Trotta, 3, Torino, TO'
    }
    const fakeFarmer2 = {
        userid: 0,
        name: 'Edward',
        surname: 'Hyde',
        place: 'Azienda Agricola di Mr. Hyde',
        address: 'Str. Val Chiapini, 70, Torino, TO'
    }
    const fakeOrder1 = {
        userid: 1,
        creationdate: '2021-12-04 10:00',
        claimdate: '2021-12-23 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'unretrieved'
    };
    const fakeOrder2 = {
        userid: 1,
        creationdate: '2021-12-05 21:00',
        claimdate: '2021-12-23 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'unretrieved'
    };
    //wrong status
    const fakeOrder3 = {
        userid: 1,
        creationdate: '2021-12-07 21:00',
        claimdate: '2021-12-23 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'confirmed'
    };
    //wrong date
    const fakeOrder4 = {
        userid: 1,
        creationdate: '2021-12-07 21:00',
        claimdate: '2021-11-11 21:00',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'unretrieved'
    };

    //order1 product1
    const fakeOrderline11 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order1 product2
    const fakeOrderline12 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order2 product2
    const fakeOrderline22 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order3 product3
    const fakeOrderline33 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };
    //order4 product3
    const fakeOrderline43 = {
        orderid: null,
        productid: null,
        quantity: 2,
        price: 3
    };

    let productid1, productid2, productid3;


    beforeAll(async () => {
        await farmerDao.deleteAllFarmers();
        await farmerDao.insertFarmer(fakeFarmer1);
        await farmerDao.insertFarmer(fakeFarmer2);
        await productDao.deleteAllProducts();
        productid1 = await productDao.insertProduct(fakeProduct1);
        productid2 = await productDao.insertProduct(fakeProduct2);
        productid3 = await productDao.insertProduct(fakeProduct3);
        await orderDao.deleteAllOrders();
        const orderid1 = await orderDao.insertOrder(fakeOrder1);
        const orderid2 = await orderDao.insertOrder(fakeOrder2);
        const orderid3 = await orderDao.insertOrder(fakeOrder3);
        const orderid4 = await orderDao.insertOrder(fakeOrder4);
        fakeOrderline11.orderid = orderid1;
        fakeOrderline12.orderid = orderid1;
        fakeOrderline22.orderid = orderid2;
        fakeOrderline33.orderid = orderid3;
        fakeOrderline43.orderid = orderid4;
        fakeOrderline11.productid = productid1;
        fakeOrderline12.productid = productid2;
        fakeOrderline22.productid = productid2;
        fakeOrderline33.productid = productid3;
        fakeOrderline43.productid = productid3;
        await orderlineDao.deleteAllOrderlines();
        await orderlineDao.insertOrderLine(fakeOrderline11);
        await orderlineDao.insertOrderLine(fakeOrderline12);
        await orderlineDao.insertOrderLine(fakeOrderline22);
        await orderlineDao.insertOrderLine(fakeOrderline33);
        await orderlineDao.insertOrderLine(fakeOrderline43);
    });

    afterAll(async () => {
        await farmerDao.deleteAllFarmers();
        await orderDao.deleteAllOrders();
        await productDao.deleteAllProducts();
        await orderlineDao.deleteAllOrderlines();
        app.close();
    });

    test("Checking date = January (it should give a report about December)", async () => {
        const expectedResult = [
            {
                productid: productid1,
                name: fakeProduct1.name,
                quantity: fakeOrderline11.quantity,
                measure: fakeProduct1.measure,
                farmerName: fakeFarmer1.name,
                farmerSurname: fakeFarmer1.surname
            },
            {
                productid: productid2,
                name: fakeProduct2.name,
                quantity: fakeOrderline12.quantity + fakeOrderline22.quantity,
                measure: fakeProduct1.measure,
                farmerName: fakeFarmer1.name,
                farmerSurname: fakeFarmer1.surname
            }
        ]
        const response = await request(app).get('/api/manager/monthlyReport/2022-01-25 21:00');
        expect(response.body).toEqual(expectedResult);
    });

    test("It should respond with 200 OK code", async () => {
        const response = await request(app).get('/api/manager/monthlyReport/2022-01-25 21:00');
        expect(response.status).toBe(200);
    });

});