'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const orderDao = require('../order-dao');
const clientDao = require('../client-dao');

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
        //clear and fill (mock) order database with fakeOrder1 and fakeOrder2 and client db with fakeClient1
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

    test('It should respond with 404 (not found) status code', async () => {
        const response = await request(app).get('/api/orders/status/notexistingstatus');
        expect(response.status).toBe(404);
    });

});
