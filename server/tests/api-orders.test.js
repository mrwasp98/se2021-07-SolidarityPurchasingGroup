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

/*
describe('Testing PUT on /api/orders/:orderid', () => {

    test('It should respond with 200 status code', async () => {
        //TODO 
        //PUT in db an item with requestId=1 before running this test
        
        const response = await request(app).put('/api/orders').send({
            requestId : 1
        })
        expect(response.statusCode).toBe(200);
    });

    test('It should respond with 404 status code', async () => {
        
        //TODO 
        //clear db before running this test
        
        const response = await request(app).put('/api/clients').send({
            requestId : 1
        })
        expect(response.statusCode).toBe(404);
    });


});
*/

describe('Testing GET on /api/orders', () => {

    const fakeOrder1 = {
        id:1, 
        userid:1, 
        creationdate:'prova', 
        claimdate:'prova', 
        confirmationdate:'prova', 
        deliveryaddress:'prova', 
        status:'confirmed'
    };
    const fakeOrder2 = {
        id:2, 
        userid:1, 
        creationdate:'prova', 
        claimdate:'prova', 
        confirmationdate:'prova', 
        deliveryaddress:'prova', 
        status:'confirmed'
    };
    const fakeOrder3 = {
        id:3, 
        userid:2, 
        creationdate:'prova', 
        claimdate:'prova', 
        confirmationdate:'prova', 
        deliveryaddress:'prova', 
        status:'confirmed'
    };
    const fakeClient1 = {
        userid: 1,
        name: 'John',
        surname: 'Doe',
        wallet: 50.30,
        address: 'Corso Duca degli Abruzzi, 21, Torino'
    };
    const fakeClient2 = {
        userid: 2,
        name: 'Jeff',
        surname: 'Doe',
        wallet: 50.30,
        address: 'Corso Duca degli Abruzzi, 21, Torino'
    };

    beforeAll(async() => {
        //clear and fill (mock) order database with fakeOrder1 and fakeOrder2 and client db with fakeClient1
        await clientDao.deleteAllClients();
        await clientDao.insertClient(fakeClient1);
        await clientDao.insertClient(fakeClient2);
        await orderDao.deleteAllOrders();
        await orderDao.insertOrder(fakeOrder1);
        await orderDao.insertOrder(fakeOrder2);
        await orderDao.insertOrder(fakeOrder3);
        
    });

    afterAll( () => {
        orderDao.deleteAllOrders();
        clientDao.deleteAllClients();
    });

    test('It should respond with an array of orders', async () => {
        const response = await request(app).get('/api/orders/?clientid=1');
        expect(response.body).toEqual([fakeOrder1,fakeOrder2]);
    });


});


