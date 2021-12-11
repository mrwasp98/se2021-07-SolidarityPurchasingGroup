'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const orderDao = require('../order-dao');
const clientDao = require('../client-dao');
const productDao = require('../product-dao');
const orderlineDao = require('../orderline-dao');

jest.setTimeout(10000);

/*
REMEMBER
Change the database in database.js before running tests
*/
const fakeClient1 = {
    userid: 1,
    name: 'John',
    surname: 'Doe',
    wallet: 50.30,
    address: 'Corso Duca degli Abruzzi, 21, Torino'
};
const fakeClient2 = {
    userid: 2,
    name: 'Mario',
    surname: 'Rossi',
    wallet: 12.30,
    address: 'Corso Mediterraneo, 70, Torino'
};
const fakeOrder1 = {
    userid: 1,
    creationdate: 'prova',
    claimdate: 'prova',
    confirmationdate: 'prova',
    deliveryaddress: 'prova',
    status: 'confirmed'
};
const fakeOrder2 = {
    userid: 1,
    creationdate: 'prova',
    claimdate: 'prova',
    confirmationdate: 'prova',
    deliveryaddress: 'prova',
    status: 'confirmed'
};
const fakeOrder3 = {
    userid: 2,
    creationdate: 'prova',
    claimdate: 'prova',
    confirmationdate: 'prova',
    deliveryaddress: 'prova',
    status: 'confirmed'
};
let id;

describe('Testing PUT on /api/orders/:orderid', () => {

    beforeAll(async () => {
        await clientDao.deleteAllClients();
        await clientDao.insertClient(fakeClient1);
    })

    afterAll(async () => {
        await clientDao.deleteAllClients();
        await orderDao.deleteAllOrders();

        app.close(); //without that, jest won't exit
    })

    beforeEach(async () => {
        await orderDao.deleteAllOrders();
    })

    test('It should respond with 200 status code', async () => {
        id = await orderDao.insertOrder(fakeOrder1);
        await request(app).put('/api/orders/'+id).send({
            status: 'completed'
        })
        const order = await orderDao.getOrder(id);
        const s = order.status;
        expect(s).toBe('completed');
    });

});


describe('Testing GET on /api/orders', () => {

    beforeAll(async () => {
        await clientDao.deleteAllClients();
        await clientDao.insertClient(fakeClient1);
        await clientDao.insertClient(fakeClient2);
        await orderDao.deleteAllOrders();
        await orderDao.insertOrder(fakeOrder1);
        await orderDao.insertOrder(fakeOrder2);
        await orderDao.insertOrder(fakeOrder3);
    });

    afterAll(async () => {
        await orderDao.deleteAllOrders();
        await clientDao.deleteAllClients();
        app.close();
    });

    test('It should respond with an array of orders', async () => {
        const response = await request(app).get('/api/orders/?clientid=1');
        //remove id field from order before testing equality
        const result = response.body.map((order) => ({
            userid: order.userid,
            creationdate: order.creationdate,
            claimdate: order.claimdate,
            confirmationdate: order.confirmationdate,
            deliveryaddress: order.deliveryaddress,
            status: order.status
        }));
        //test equality
        expect(result).toEqual([fakeOrder1, fakeOrder2]);
    });
});

describe('Testing GET on /api/orders/status/:status', () => {

    const fakeOrderPending1 = {
        userid: 1,
        creationdate: 'prova',
        claimdate: 'prova',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'pending'
    };
    const fakeOrderPending2 = {
        userid: 2,
        creationdate: 'prova',
        claimdate: 'prova',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'pending'
    };
    const fakeOrderConfirmed1 = {
        userid: 2,
        creationdate: 'prova',
        claimdate: 'prova',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'confirmed'
    };

    beforeAll(async () => {
        //clear and fill (mock) order database with fakeOrder1 and fakeOrder2 and client db with fakeClient1
        await clientDao.deleteAllClients();
        await clientDao.insertClient(fakeClient1);
        await clientDao.insertClient(fakeClient2);
        await orderDao.deleteAllOrders();
        await orderDao.insertOrder(fakeOrderPending1);
        await orderDao.insertOrder(fakeOrderPending2);
        await orderDao.insertOrder(fakeOrderConfirmed1);
    });

    afterAll(async () => {
        await orderDao.deleteAllOrders();
        await clientDao.deleteAllClients();
        app.close();
    });

    test('It should respond with an array of orders with status Pending', async () => {
        const response = await request(app).get('/api/orders/status/pending');
        //remove id field from order before testing equality
        const result = response.body.map((order) => ({
            userid: order.userid,
            creationdate: order.creationdate,
            claimdate: order.claimdate,
            confirmationdate: order.confirmationdate,
            deliveryaddress: order.deliveryaddress,
            status: order.status
        }));
        //test equality
        expect(result).toEqual([fakeOrderPending1, fakeOrderPending2]);
    });

    test('It should respond with an empty array', async () => {
        const response = await request(app).get('/api/orders/status/notexistingstatus');
        expect(response.body).toStrictEqual([]);
    });

});

describe('Testing GET on /api/orders/farmers', () => {
    //parameters are in query

    /*
        Farmer 1 has one product (1) in fakeOrder2 and two products (0 and 1) in fakeOrder1

        fakeOrder1 has products 0 and 1
        fakeOrder2 has products 1 and 3
    */  

    const fakeClient1 = {
        userid: 1,
        name: 'John',
        surname: 'Doe',
        wallet: 50.30,
        address: 'Corso Duca degli Abruzzi, 21, Torino'
    };
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
        farmerid: 1,
        price: 15.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    } 
    const fakeProduct3 = {
        id: 2,
        name: 'Mela',
        description: 'prova description3',
        farmerid: 0,
        price: 11.00,
        measure: 'kg',
        category: 'Fruit',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeOrder1 = {
        userid: 1,
        creationdate: '2021-12-04 10:00',
        claimdate: 'prova',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'confirmed'
    };
    const fakeOrder2 = {
        userid: 1,
        creationdate: '2021-12-05 21:00',
        claimdate: 'prova',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'confirmed'
    };
    const fakeOrder3 = {
        userid: 1,
        creationdate: '2021-12-07 21:00',
        claimdate: 'prova',
        confirmationdate: 'prova',
        deliveryaddress: 'prova',
        status: 'confirmed'
    };
    const fakeOrderline11={
        orderid:null,
        productid:0,
        quantity:2,
        price:3
    };
    const fakeOrderline12={
        orderid:null,
        productid:1,
        quantity:2,
        price:3
    };
    const fakeOrderline22={
        orderid:null,
        productid:1,
        quantity:2,
        price:3
    };
    const fakeOrderline23={
        orderid:null,
        productid:2,
        quantity:2,
        price:3
    };


    beforeAll(async () => {
        //clear and fill (mock) order database with fakeOrder1 and fakeOrder2 and client db with fakeClient1
        await clientDao.deleteAllClients();
        await clientDao.insertClient(fakeClient1);
        await productDao.deleteAllProducts();
        await productDao.insertProduct(fakeProduct1);
        await productDao.insertProduct(fakeProduct2);
        await productDao.insertProduct(fakeProduct3);
        await orderDao.deleteAllOrders();
        const orderid1=await orderDao.insertOrder(fakeOrder1);
        const orderid2=await orderDao.insertOrder(fakeOrder2);
        await orderDao.insertOrder(fakeOrder3); //should be ignored because it's in a wrong date range
        fakeOrderline11.orderid=orderid1;
        fakeOrderline12.orderid=orderid1;
        fakeOrderline22.orderid=orderid2;
        fakeOrderline23.orderid=orderid2;
        await orderlineDao.deleteAllOrderlines();
        await orderlineDao.insertOrderLine(fakeOrderline11);
        await orderlineDao.insertOrderLine(fakeOrderline12);
        await orderlineDao.insertOrderLine(fakeOrderline22);
        await orderlineDao.insertOrderLine(fakeOrderline23);
    });

    afterAll(async () => {
        await orderDao.deleteAllOrders();
        await clientDao.deleteAllClients();
        app.close();
    });

    test('It should respond with an array of orderlines related to farmerid 1', async () => {
        const response = await request(app).get('/api/orders/farmers?farmerid=1&date=2021-12-10');
        const res1={
            orderid:fakeOrderline11.orderid,
            productid:fakeOrderline11.productid,
            name:fakeProduct1.name,
            quantity:fakeOrderline11.quantity,
            measure:fakeProduct1.measure,
            price:fakeOrderline11.price
        };
        const res2={
            orderid:fakeOrderline12.orderid,
            productid:fakeOrderline12.productid,
            name:fakeProduct2.name,
            quantity:fakeOrderline12.quantity,
            measure:fakeProduct2.measure,
            price:fakeOrderline12.price
        }
        const res3={
            orderid:fakeOrderline22.orderid,
            productid:fakeOrderline22.productid,
            name:fakeProduct2.name,
            quantity:fakeOrderline22.quantity,
            measure:fakeProduct2.measure,
            price:fakeOrderline22.price
        }
        expect(response.body).toEqual([res1,res2,res3]);
    });

    test('It should respond with an array of orderlines related to farmerid 1 (test for an edge case for date)', async () => {
        const response = await request(app).get('/api/orders/farmers?farmerid=1&date=2021-12-5 23:30');
        const res1={
            orderid:fakeOrderline11.orderid,
            productid:fakeOrderline11.productid,
            name:fakeProduct1.name,
            quantity:fakeOrderline11.quantity,
            measure:fakeProduct1.measure,
            price:fakeOrderline11.price
        };
        const res2={
            orderid:fakeOrderline12.orderid,
            productid:fakeOrderline12.productid,
            name:fakeProduct2.name,
            quantity:fakeOrderline12.quantity,
            measure:fakeProduct2.measure,
            price:fakeOrderline12.price
        }
        const res3={
            orderid:fakeOrderline22.orderid,
            productid:fakeOrderline22.productid,
            name:fakeProduct2.name,
            quantity:fakeOrderline22.quantity,
            measure:fakeProduct2.measure,
            price:fakeOrderline22.price
        }
        expect(response.body).toEqual([res1,res2,res3]);
    });

    test('It should respond with 200 status code', async () => {
        const response = await request(app).get('/api/orders/farmers?farmerid=1&date=2021-12-10');
        expect(response.status).toBe(200);
    });

    test('It should respond with an empty array', async () => {
        const response = await request(app).get('/api/orders/farmers?farmerid=5&date=2021-12-10');
        expect(response.body).toEqual([]);
    });
   

});
