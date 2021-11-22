'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const orderDao = require('../order-dao');
const orderlineDao = require('../orderline-dao');
const clientDao = require('../client-dao');
const productDao = require('../product-dao');


jest.setTimeout(10000);

let client1 = {
    userid: 1, //will be changed at execution time
    name: 'John',
    surname: 'Doe',
    wallet: 50.30,
    address: 'Corso Duca degli Abruzzi, 21, Torino'
};

let product1 = {
    id: 1, //will be changed at execution time
    name: "Carote",
    quantity: 3,
    measure: "kg",
    price: 12.10
};
let product2 = {
    id: 2, //will be changed at execution time
    name: "Patate",
    quantity: 2,
    measure: "kg",
    price: 20.11
};
let product3 = {
    id: 3, //will be changed at execution time
    name: "Tomino di Capra",
    quantity: 3,
    measure: "kg",
    price: 12.10
};

let order1 = {
    id: 1, //will be changed at execution time
    userid: 1, //will be changed at execution time (client1 id)
    creationdate: "2021-11-09",
    claimdate: "2021-11-10 12:30",
    confirmationdate: "2021-11-09",
    deliveryaddress: null,
    deliveryid: null,
    status: "confirmed"
};
let order2 = {
    id: 2, //will be changed at execution time
    userid: 1, //will be changed at execution time (client1 id)
    creationdate: "2021-11-09",
    claimdate: "2021-11-10 12:30",
    confirmationdate: "2021-11-09",
    deliveryaddress: null,
    deliveryid: null,
    status: "confirmed"
};
let order3 = {
    id: 3, //will be changed at execution time
    userid: 6,
    creationdate: "2021-11-09",
    claimdate: "2021-11-10 12:30",
    confirmationdate: "2021-11-09",
    deliveryaddress: null,
    deliveryid: null,
    status: "confirmed"
};
let completeOrder1, completeOrder2;


describe('Testing GET on /api/completeOrders', () => {

    beforeAll(async () => {
        //clear all
        await clientDao.deleteAllClients();
        await orderDao.deleteAllOrders();
        await orderlineDao.deleteAllOrderlines(); //TODO
        await productDao.deleteAllProducts();
        //insert client
        client1.userid = await clientDao.insertClient(client1);
        //insert products
        product1.id = await productDao.insertProduct(product1);
        product2.id = await productDao.insertProduct(product2);
        product3.id = await productDao.insertProduct(product3);
        //insert orders (1 and 2 are related to client1, order3 is not)
        order1.userid = client1.userid;
        order2.userid = client1.userid;
        order3.userid = client1.userid + 1;
        order1.id = await orderDao.insertOrder(order1);
        order2.id = await orderDao.insertOrder(order2);
        order3.id = await orderDao.insertOrder(order3);
        //insert order lines
        await orderlineDao.insertOrderLine({
            orderid: order1.id,
            productid: product1.id,
            quantity: 3,
            price: 12.10
        });
        await orderlineDao.insertOrderLine({
            orderid: order1.id,
            productid: product2.id,
            quantity: 2,
            price: 20.11
        });
        await orderlineDao.insertOrderLine({
            orderid: order2.id,
            productid: product3.id,
            quantity: 3,
            price: 12.10
        });
        //create complete orders
        completeOrder1 = {
            id: order1.id,
            userid: client1.userid,
            creationdate: "2021-11-09",
            claimdate: "2021-11-10 12:30",
            confirmationdate: "2021-11-09",
            deliveryaddress: null,
            status: "confirmed",
            products: [product1, product2]
        };
        completeOrder2 = {
            id: order2.id,
            userid: client1.userid,
            creationdate: "2021-11-09",
            claimdate: "2021-11-10 12:30",
            confirmationdate: "2021-11-09",
            deliveryaddress: null,
            status: "confirmed",
            products: [product3]
        };
    });

    afterAll(async () => {
        await clientDao.deleteAllClients();
        await orderDao.deleteAllOrders();
        await orderlineDao.deleteAllOrderlines();
        await productDao.deleteAllProducts();
        app.close(); //without that, jest won't exit
    });

    test('It should respond with an array of orders with products', async () => {
        const response = await request(app).get('/api/completeOrders?clientid=' + client1.userid);
        //test equality
        expect(response.body).toEqual([completeOrder1, completeOrder2]);
    });
});

