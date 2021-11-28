'use strict';

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
const fakeOrder1 = {
    userid: 1,
    creationdate: 'prova',
    claimdate: 'prova',
    confirmationdate: 'prova',
    deliveryaddress: 'prova',
    status: 'confirmed'
};

describe('Testing order-dao functions unused in any api', () => {

    beforeAll(async () => {
        await orderDao.deleteAllOrders();
        await clientDao.deleteAllClients();
    })

    afterEach(async () => {
        await orderDao.deleteAllOrders();
        await clientDao.deleteAllClients();
    })

    afterAll(async () => {
        app.close();
    })

    test('Testing deleteOrder function', async () => {
        await clientDao.insertClient(fakeClient1);
        const orderid = await orderDao.insertOrder(fakeOrder1);
        await orderDao.deleteOrder(orderid);
        const result = await orderDao.getOrder(orderid);
        expect(result).toBe(undefined);
    });

});