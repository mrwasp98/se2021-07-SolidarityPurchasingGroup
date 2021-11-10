'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const orderDao = require('../order-dao');
const clientDao = require('../client-dao');

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
        deliveryid:1, 
        status:'confirmed'
    }
    const fakeOrder2 = {
        id:2, 
        userid:2, 
        creationdate:'prova', 
        claimdate:'prova', 
        confirmationdate:'prova', 
        deliveryaddress:'prova', 
        deliveryid:1, 
        status:'confirmed'
    }
    const fakeClient1 = {
        userid: 1,
        name: 'John',
        surname: 'Doe',
        wallet: 50.30,
        address: 'Corso Duca degli Abruzzi, 21, Torino'
    }

    beforeEach(() => {
        //clear and fill (mock) order database with fakeOrder1 and fakeOrder2 and client db with fakeClient1
        orderDao.deleteAllOrders();
        clientDao.deleteAllClients();
        orderDao.insertOrder(fakeOrder1);
        orderDao.insertOrder(fakeOrder2);
        clientDao.insertClient(fakeClient1);
    });

    afterEach(() => {
        orderDao.deleteAllOrders();
        clientDao.deleteAllClients();
    });

    test('It should respond with 200 status code', async () => {
        const response = await (await request(app).get('/api/clients/?clientid=1'));
        expect(response.body).toEqual([fakeOrder1]);
    });


});


