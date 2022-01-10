'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const productDao = require('../product-dao');
const availabilityDao = require('../availability-dao');
const orderDao = require('../order-dao');
const orderlineDao = require('../orderline-dao');
const clientDao = require('../client-dao');

/*
REMEMBER
Change the database in database.js before running tests
*/
const fakeClient1 = {
    userid: 1,
    name: 'John',
    surname: 'Doe',
    wallet: 100,
    address: 'Corso Duca degli Abruzzi, 21, Torino'
}
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
    name: 'Apple',
    description: 'prova description2',
    farmerid: 1,
    price: 1,
    measure: 'kg',
    category: 'Vegetables',
    typeofproduction: 'Bio',
    picture: ''
}
const fakeAvailability1 = {
    productid: null,
    dateavailability: '2021-10-11',
    quantity: 6,
    status: 'initial',
    price: 15.00,
    initialquantity: 6
}
const fakeAvailability2 = {
    productid: null,
    dateavailability: '2021-10-12',
    quantity: 6,
    status: 'initial',
    price: 15.00,
    initialquantity: 6
}
let productid, productid2;

describe('Testing POST on /api/availability', () => {

    beforeEach(async () => {
        await productDao.deleteAvailability();
        await productDao.deleteAllProducts();
        productid = await productDao.insertProduct(fakeProduct1);
        fakeAvailability1.productid = productid;
    });

    afterAll(async () => {
        await productDao.deleteAvailability();
        app.close();
    });

    test("It should respond with 200 status code", async () => {
        const response = await request(app).post('/api/availability').send(fakeAvailability1);
        expect(response.statusCode).toBe(200);
    });

});


describe('Testing PUT on /api/availabilities', () => {

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
        name: 'Apple',
        description: 'prova description2',
        farmerid: 1,
        price: 1,
        measure: 'kg',
        category: 'Vegetables',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeAvailability1 = {
        productid: null,
        dateavailability: '2022-01-11 10:00',
        quantity: 6,
        status: 'initial',
        price: 15.00,
        initialquantity: 6
    }
    const fakeAvailability2 = {
        productid: null,
        dateavailability: '2022-01-11 10:00',
        quantity: 6,
        status: 'initial',
        price: 15.00,
        initialquantity: 6
    }
    let productid, productid2;

    beforeEach(async () => {
        await clientDao.deleteAllClients();
        await clientDao.insertClient(fakeClient1);
        await productDao.deleteAvailability();
        await productDao.deleteAllProducts();
        productid = await productDao.insertProduct(fakeProduct1);
        fakeAvailability1.productid = productid;
        await productDao.insertAvailability(fakeAvailability1);
        productid2 = await productDao.insertProduct(fakeProduct2);
        fakeAvailability2.productid = productid2;
        await productDao.insertAvailability(fakeAvailability2);
    });

    afterAll(async () => {
        await productDao.deleteAvailability();
        await orderlineDao.deleteAllOrderlines();
        await clientDao.deleteAllClients();
        app.close();
    });

    test("It should update fakeAvailability1 status", async () => {
        await request(app).put('/api/availabilities').send(
            [
                {
                    productid: productid,
                    dateavailability: fakeAvailability1.dateavailability,
                    status: true
                },
                {
                    productid: productid2,
                    dateavailability: fakeAvailability2.dateavailability,
                    status: false
                }
            ]
        );
        const availability = await availabilityDao.getAvailability(fakeAvailability1.productid, fakeAvailability1.dateavailability);
        expect(availability.status).toBe('confirmed');
    });

    test("It should update fakeAvailability2 status", async () => {
        await request(app).put('/api/availabilities').send(
            [
                {
                    productid: productid,
                    dateavailability: fakeAvailability1.dateavailability,
                    status: true
                },
                {
                    productid: productid2,
                    dateavailability: fakeAvailability2.dateavailability,
                    status: false
                }
            ]
        );
        const availability = await availabilityDao.getAvailability(fakeAvailability2.productid, fakeAvailability2.dateavailability);
        expect(availability.status).toBe('failed');
    });

    //test if it updates orderlines status to the related availability status
    test("It should put to 'confirmed' orderlines related to product 1", async () => {
        const fakeOrderline1 = { //order 1 product 1
            orderid: null,
            productid: productid,
            quantity: 2,
            price: 3
        };
        const fakeOrderline2 = { //order 2 product 1
            orderid: null,
            productid: productid,
            quantity: 2,
            price: 3
        };
        const fakeOrderline3 = { //order 3 product 2
            orderid: null,
            productid: productid2,
            quantity: 2,
            price: 3
        };
        const fakeOrder1 = {
            userid: 1,
            creationdate: '2022-01-15 10:00',
            claimdate: 'prova',
            confirmationdate: 'prova',
            deliveryaddress: 'prova',
            status: 'confirmed'
        };
        const fakeOrder2 = {
            userid: 1,
            creationdate: '2022-01-15 10:00',
            claimdate: 'prova',
            confirmationdate: 'prova',
            deliveryaddress: 'prova',
            status: 'confirmed'
        };
        const fakeOrder3 = {
            userid: 1,
            creationdate: '2022-01-15 10:00',
            claimdate: 'prova',
            confirmationdate: 'prova',
            deliveryaddress: 'prova',
            status: 'confirmed'
        };
        await orderDao.deleteAllOrders();
        fakeOrderline1.orderid = await orderDao.insertOrder(fakeOrder1);
        fakeOrderline2.orderid = await orderDao.insertOrder(fakeOrder2);
        fakeOrderline3.orderid = await orderDao.insertOrder(fakeOrder3);
        await orderlineDao.insertOrderLine(fakeOrderline1);
        await orderlineDao.insertOrderLine(fakeOrderline2);
        await orderlineDao.insertOrderLine(fakeOrderline3);
        await request(app).put('/api/availabilities').send(
            [
                { //all product 1 orderlines should have status confirmed
                    productid: productid,
                    dateavailability: fakeAvailability1.dateavailability,
                    status: true
                },
                {  
                    productid: productid2,
                    dateavailability: fakeAvailability2.dateavailability,
                    status: true
                }
            ]
        );
        //orderline 1 and orderline 2 status should be 'confirmed'
        const orderline1 = await orderlineDao.getOrderLine(fakeOrderline1.orderid,productid);
        const orderline2 = await orderlineDao.getOrderLine(fakeOrderline2.orderid,productid);
        const res = orderline1.status=='confirmed' && orderline2.status=='confirmed';
        expect(res).toBe(true);
    });

    //test if when all orderlines of an order are 'confirmed', the order will become confirmed
    test("It should put to 'confirmed' the order status", async () => {
        const fakeOrderline1 = { //order 1 product 1
            orderid: null,
            productid: productid,
            quantity: 2,
            price: 3
        };
        const fakeOrderline2 = { //order 1 product 2
            orderid: null,
            productid: productid2,
            quantity: 2,
            price: 3
        };
        const fakeOrder1 = {
            userid: 1,
            creationdate: '2022-01-15 10:00',
            claimdate: 'prova',
            confirmationdate: 'prova',
            deliveryaddress: 'prova',
            status: 'pending'
        };
        await orderDao.deleteAllOrders();
        const orderid1 = await orderDao.insertOrder(fakeOrder1);
        fakeOrderline1.orderid = orderid1;
        fakeOrderline2.orderid = orderid1;
        await orderlineDao.insertOrderLine(fakeOrderline1);
        await orderlineDao.insertOrderLine(fakeOrderline2);
        await request(app).put('/api/availabilities').send(
            [
                {
                    productid: productid,
                    dateavailability: fakeAvailability1.dateavailability,
                    status: true
                },
                {  
                    productid: productid2,
                    dateavailability: fakeAvailability2.dateavailability,
                    status: true
                }
            ]
        );
        const order = await orderDao.getOrder(orderid1);
        expect(order.status).toBe('confirmed');
    });

    //test if just one orderline of an order is 'failed', the order will become failed
    test("It should put to 'failed' the order status", async () => {
        const fakeOrderline1 = { //order 1 product 1
            orderid: null,
            productid: productid,
            quantity: 2,
            price: 3
        };
        const fakeOrderline2 = { //order 1 product 2
            orderid: null,
            productid: productid2,
            quantity: 2,
            price: 3
        };
        const fakeOrder1 = {
            userid: 1,
            creationdate: '2022-01-15 10:00',
            claimdate: 'prova',
            confirmationdate: 'prova',
            deliveryaddress: 'prova',
            status: 'pending'
        };
        await orderDao.deleteAllOrders();
        const orderid1 = await orderDao.insertOrder(fakeOrder1);
        fakeOrderline1.orderid = orderid1;
        fakeOrderline2.orderid = orderid1;
        await orderlineDao.insertOrderLine(fakeOrderline1);
        await orderlineDao.insertOrderLine(fakeOrderline2);
        await request(app).put('/api/availabilities').send(
            [
                {
                    productid: productid,
                    dateavailability: fakeAvailability1.dateavailability,
                    status: true
                },
                {  
                    productid: productid2,
                    dateavailability: fakeAvailability2.dateavailability,
                    status: false
                }
            ]
        );
        const order = await orderDao.getOrder(orderid1);
        expect(order.status).toBe('failed');
    });

    //test if when an order is confirmed and the client's wallet isn't enough, the order status will become pending
    test("It should put to 'waitingForCharge' the order status", async () => {
        const fakeOrderline1 = { //order 1 product 1
            orderid: null,
            productid: productid,
            quantity: 2,
            price: 50
        };
        const fakeOrderline2 = { //order 1 product 2
            orderid: null,
            productid: productid2,
            quantity: 2,
            price: 60
        };
        const fakeOrder1 = {
            userid: fakeClient1.userid,
            creationdate: '2022-01-15 10:00',
            claimdate: 'prova',
            confirmationdate: 'prova',
            deliveryaddress: 'prova',
            status: 'confirmed'
        };
        await orderDao.deleteAllOrders();
        const orderid1 = await orderDao.insertOrder(fakeOrder1);
        fakeOrderline1.orderid = orderid1;
        fakeOrderline2.orderid = orderid1;
        await orderlineDao.insertOrderLine(fakeOrderline1);
        await orderlineDao.insertOrderLine(fakeOrderline2);
        await request(app).put('/api/availabilities').send(
            [
                {
                    productid: productid,
                    dateavailability: fakeAvailability1.dateavailability,
                    status: true
                },
                {  
                    productid: productid2,
                    dateavailability: fakeAvailability2.dateavailability,
                    status: true
                }
            ]
        );
        const order = await orderDao.getOrder(orderid1);
        expect(order.status).toBe('waitingForCharge');
    });

    //test if when an order is confirmed and the client's wallet is enough, the client's wallet should be decremented
    test("It should decrement the user wallet", async () => {
        const fakeOrderline1 = { //order 1 product 1
            orderid: null,
            productid: productid,
            quantity: 1,
            price: 50
        };
        const fakeOrderline2 = { //order 1 product 2
            orderid: null,
            productid: productid2,
            quantity: 1,
            price: 40
        };
        const fakeOrder1 = {
            userid: fakeClient1.userid,
            creationdate: '2022-01-15 10:00',
            claimdate: 'prova',
            confirmationdate: 'prova',
            deliveryaddress: 'prova',
            status: 'confirmed'
        };
        await orderDao.deleteAllOrders();
        const orderid1 = await orderDao.insertOrder(fakeOrder1);
        fakeOrderline1.orderid = orderid1;
        fakeOrderline2.orderid = orderid1;
        await orderlineDao.insertOrderLine(fakeOrderline1);
        await orderlineDao.insertOrderLine(fakeOrderline2);
        await request(app).put('/api/availabilities').send(
            [
                {
                    productid: productid,
                    dateavailability: fakeAvailability1.dateavailability,
                    status: true
                },
                {  
                    productid: productid2,
                    dateavailability: fakeAvailability2.dateavailability,
                    status: true
                }
            ]
        );
        const client = await clientDao.getClientById(1);
        expect(client.wallet).toBe(10);
    });

});


describe('Testing GET on /api/availability/:farmerid?date=', () => {

    
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
        name: 'Apple',
        description: 'prova description2',
        farmerid: 1,
        price: 1,
        measure: 'kg',
        category: 'Vegetables',
        typeofproduction: 'Bio',
        picture: ''
    }
    const fakeAvailability1 = {
        productid: null,
        dateavailability: '2022-01-7 10:00',
        quantity: 6,
        status: 'pending',
        price: 15.00,
        initialquantity: 6
    }
    const fakeAvailability2 = {
        productid: null,
        dateavailability: '2022-01-7 10:00',
        quantity: 6,
        status: 'pending',
        price: 15.00,
        initialquantity: 6
    }
    const fakeAvailability3 = {
        productid: null,
        dateavailability: '2022-01-23 10:00',
        quantity: 6,
        status: 'pending',
        price: 15.00,
        initialquantity: 6
    }
    const fakeAvailability4 = {
        productid: null,
        dateavailability: '2022-01-4 10:00',
        quantity: 6,
        status: 'ok',
        price: 15.00,
        initialquantity: 6
    }
    let productid, productid2;
 

    beforeEach(async() => {
        await productDao.deleteAvailability();
        await productDao.deleteAllProducts();
        productid = await productDao.insertProduct(fakeProduct1);
        fakeAvailability1.productid = productid;
        fakeAvailability3.productid = productid;
        await productDao.insertAvailability(fakeAvailability1);
        await productDao.insertAvailability(fakeAvailability3);
        productid2 = await productDao.insertProduct(fakeProduct2);
        fakeAvailability2.productid = productid2;
        fakeAvailability4.productid = productid2;
        await productDao.insertAvailability(fakeAvailability2);
        await productDao.insertAvailability(fakeAvailability4);

    });

    afterAll(async() => {
        await productDao.deleteAvailability();
        await productDao.deleteAllProducts();

        app.close(); //without that, jest won't exit
    }); 

    //remember: mock database should be pre-filled with
    //fakeProduct1 and fakeProduct2 for this method to work
    test("It should respond with an array of availabilities", async () => {
        const response = await request(app).get('/api/availability/1?date=Sun%20Jan%2009%202022%2000:00:00%20GMT+0100%20(CET)');
        const fakeAv1 = {
            productid: productid, 
            productName: 'Artichoke', 
            dateavailability: '2022-01-7 10:00', 
            quantity: 6, 
            measure: 'kg', 
            status: 'pending', 
            price: 15.00
        }
        const fakeAv2 = {
            productid: productid2, 
            productName: 'Apple', 
            dateavailability: '2022-01-7 10:00', 
            quantity: 6, 
            measure: 'kg', 
            status: 'pending', 
            price: 15.00
        }
        expect(response.body).toEqual([fakeAv1, fakeAv2]);
    });

    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get('/api/availability/1?date=Sun%20Jan%2009%202022%2000:00:00%20GMT+0100%20(CET)');
        expect(response.statusCode).toBe(200);
    });

    test("It should respond with a 404 status code", async () => {
        const response = await request(app).get('/api/availabilty/1?date=Sun%20Jan%2009%202022%2000:00:00%20GMT+0100%20(CET)');
        expect(response.statusCode).toBe(404);
    });
 
});