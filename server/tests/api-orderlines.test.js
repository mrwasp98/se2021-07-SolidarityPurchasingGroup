'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const orderlineDao = require('../orderline-dao');
const orderDao = require('../order-dao');
const clientDao = require('../client-dao');
const productDao = require('../product-dao');

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
    farmerid: 2,
    price: 15.00,
    measure: 'kg',
    category: 'Fruit',
    typeofproduction: 'Bio',
    picture: ''
}
const fakeOrder1 = {
    userid: 1,
    creationdate: 'prova',
    claimdate: 'prova',
    confirmationdate: 'prova',
    deliveryaddress: 'prova',
    status: 'confirmed'
};
let orderid;

describe('Testing PUT on /api/orderlines', () => {
    //parameters are in body

    beforeAll(async () => {
        await clientDao.deleteAllClients();
        await productDao.deleteAllProducts();
        await orderlineDao.deleteAllOrderlines();
        await clientDao.insertClient(fakeClient1);
        await productDao.insertProduct(fakeProduct1);
        await productDao.insertProduct(fakeProduct2);
    })

    afterAll(async () => {
        await clientDao.deleteAllClients();
        await productDao.deleteAllProducts();
        await orderDao.deleteAllOrders();
        await orderlineDao.deleteAllOrderlines();
        app.close(); //without that, jest won't exit
    })

    beforeEach(async () => {
        await orderDao.deleteAllOrders();
        await orderlineDao.deleteAllOrderlines();
        orderid = await orderDao.insertOrder(fakeOrder1);
    })

    test('It should update the orderline status', async () => {
        await orderlineDao.insertOrderLine({
            orderid:orderid,
            productid:0,
            quantity:1,
            price:2.0
        });
        await request(app).put('/api/orderlines/').send({
            orderid: orderid,
            productid: 0,
            status: 'packaged'
        })
        const orderline= await orderlineDao.getOrderLine(orderid,0);
        expect(orderline.status).toBe('packaged');
    });

    test('It should respond with 200 status code', async () => {
        await orderlineDao.insertOrderLine({
            orderid:orderid,
            productid:0,
            quantity:1,
            price:2.0
        });
        const result = await request(app).put('/api/orderlines/').send({
            orderid: orderid,
            productid: 0,
            status: 'packaged'
        })
        expect(result.status).toBe(200);
    });

    test('It should set to packaged the order status', async () => {
        //when all orderlines of an order are 'packaged', the order should become 'packaged'
        await orderlineDao.insertOrderLine({
            orderid:orderid,
            productid:0,
            quantity:1,
            price:2.0
        });
        await orderlineDao.insertOrderLine({
            orderid:orderid,
            productid:1,
            quantity:1,
            price:2.0
        });
        await request(app).put('/api/orderlines/').send({
            orderid: orderid,
            productid: 0,
            status: 'packaged'
        })
        await request(app).put('/api/orderlines/').send({
            orderid: orderid,
            productid: 1,
            status: 'packaged'
        })
        const order=await orderDao.getOrder(orderid);
        expect(order.status).toBe('packaged');
    });

    test('It should NOT set to packaged the order status', async () => {
        await orderlineDao.insertOrderLine({
            orderid:orderid,
            productid:0,
            quantity:1,
            price:2.0
        });
        await orderlineDao.insertOrderLine({
            orderid:orderid,
            productid:1,
            quantity:1,
            price:2.0
        });
        await request(app).put('/api/orderlines/').send({
            orderid: orderid,
            productid: 0,
            status: 'packaged'
        })
        const order=await orderDao.getOrder(orderid);
        expect(order.status).toBe(fakeOrder1.status);
    });

});


