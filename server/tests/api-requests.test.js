'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing POST on /api/requests', () => {

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/api/requests').send({
            userid: 0,
            creationdate: '01/01/2021',
            claimdate: '01/02/2021',
            confirmationdate: '',
            deliveryaddress: 'Corso Duca degli Abruzzi, 21, Torino',
            deliveryid: 1,
            status: '',
            productid: 0,
            quantity: 2,
            price: '3,50'
        })
        expect(response.statusCode).toBe(200);
    });

    describe('It should respond with 404 (Bad Request) status code', () => {

        test('Case of one parameter missing', async () => {
            const obj = {
                userid: 0,
                creationdate: '01/01/2021',
                claimdate: '01/02/2021',
                confirmationdate: '',
                deliveryaddress: 'Corso Duca degli Abruzzi, 21, Torino',
                deliveryid: 1,
                status: '',
                productid: 0,
                quantity: 2,
                price: '3,50'
            };
            for (let [key,value] of Object.entries(obj)) {
                //at each iteration it will create an object with one parameter missing
                const wrongObjArray = Object.entries(obj).filter( keyValue => JSON.stringify(keyValue)!==JSON.stringify([key,value]));
                //need to convert from array to object
                const wrongObj = Object.fromEntries(wrongObjArray);
                const response = await request(app).post('/api/requests').send(wrongObj);
                expect(response.statusCode).toBe(400);
            }
        });

        //TODO wrong parameter type tests
    
    });

});

