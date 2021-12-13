'use strict';

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
const fakeOrder1 = {
    userid: 1,
    creationdate: 'prova',
    claimdate: 'prova',
    confirmationdate: 'prova',
    deliveryaddress: 'prova',
    status: 'confirmed'
};
let orderid,productid1,productid2;

describe('Test orderline-dao functions unused in any api', () => {


    beforeAll(async () => {
        await clientDao.deleteAllClients();
        await productDao.deleteAllProducts();
        await clientDao.insertClient(fakeClient1);
        productid1 = await productDao.insertProduct(fakeProduct1);
        productid2 = await productDao.insertProduct(fakeProduct2);
        await orderDao.deleteAllOrders();
        await orderlineDao.deleteAllOrderlines();
        orderid = await orderDao.insertOrder(fakeOrder1);

    })

    afterAll(async () => {
        await clientDao.deleteAllClients();
        await productDao.deleteAllProducts();
        await orderDao.deleteAllOrders();
        await orderlineDao.deleteAllOrderlines();
        app.close(); //without that, jest won't exit
    })

    test('Testing getOrderLines function (positive result)', async () => {
        const fakeOrderLine1 = {
            orderid: orderid,
            productid: productid1,
            quantity: 2,
            price: 3,
            status: null
        };
        const fakeOrderLine2 = {
            orderid: orderid,
            productid: productid2,
            quantity: 2,
            price: 3,
            status: null
        };
        await orderlineDao.insertOrderLine(fakeOrderLine1);
        await orderlineDao.insertOrderLine(fakeOrderLine2);
        const response = await orderlineDao.getOrderLines(orderid);
        expect(response).toEqual([fakeOrderLine1, fakeOrderLine2]);
    });

    test('Testing getOrderLines function (orderline not found)', async () => {
        const fakeOrderLine1 = {
            orderid: orderid,
            productid: 0,
            quantity: 2,
            price: 3,
            status: null
        };
        const fakeOrderLine2 = {
            orderid: orderid,
            productid: 1,
            quantity: 2,
            price: 3,
            status: null
        };
        await orderlineDao.insertOrderLine(fakeOrderLine1);
        await orderlineDao.insertOrderLine(fakeOrderLine2);
        const response = await orderlineDao.getOrderLines(orderid + 1);
        expect(response).toEqual([]);
    });

});