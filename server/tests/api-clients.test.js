'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const clientDao = require('../client-dao');
const userDao = require('../user-dao');
let userId1;
let userId2;
let userId3;

jest.setTimeout(10000);

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing GET on /api/clients', () => {

    const fakeUser1 = {
        username: 'group07@gmail.com',
        password: 'abc123',
        type: 'client'
    };

    const fakeUser2 = {
        username: 'group07-1@gmail.com',
        password: 'abc123',
        type: 'farmer'
    };

    const fakeUser3 = {
        username: 'group07-2@gmail.com',
        password: 'abc123',
        type: 'client'
    };
    beforeEach(async () => {
        //clear and fill (mock) client database with fakeClient1 and fakeClient2
        await userDao.deleteAllUsers();
        userId1 = await userDao.insertUser(fakeUser1);
        userId2 =  await userDao.insertUser(fakeUser2);
        userId3 =  await userDao.insertUser(fakeUser3);

        const fakeClient1 = {
            userid: userId1,
            name: 'John',
            surname: 'Doe',
            wallet: 50.30,
            address: 'Corso Duca degli Abruzzi, 21, Torino'
        }
        const fakeClient2 = {
            userid: userId2,
            name: 'Mario',
            surname: 'Rossi',
            wallet: 12.30,
            address: 'Corso Mediterraneo, 70, Torino'
        }

        await clientDao.deleteAllClients();
        await clientDao.insertClient(fakeClient1);
        await clientDao.insertClient(fakeClient2);
    });

    afterEach(async () => {
        await userDao.deleteAllUsers();
        await clientDao.deleteAllClients();
    });

    /*remember: mock database should be pre-filled with
    fakeClient1 and fakeClient2 for this method to work*/
    test("It should respond with an array of clients", async () => {
        const response = await request(app).get('/api/clients');
        const fakeClient1 = {
            userid: userId1,
            name: 'John',
            surname: 'Doe',
            wallet: 50.30,
            address: 'Corso Duca degli Abruzzi, 21, Torino'
        }
        const fakeClient2 = {
            userid: userId2,
            name: 'Mario',
            surname: 'Rossi',
            wallet: 12.30,
            address: 'Corso Mediterraneo, 70, Torino'
        }
        expect(response.body).toEqual([fakeClient1, fakeClient2]);
    });

});



describe('Testing POST on /api/clients', () => {

    afterEach(() => {
        clientDao.deleteAllClients();
    });

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/api/client').send({
            userid: userId1,
            name: 'Grrmafa',
            surname: 'Idcamcv',
            email: 'Idcamcv@gmail.com',
            wallet: 50.30,
            address: 'Corso Duca degli Abruzzi, 21, Torino'
        })
        expect(response.statusCode).toBe(200);
    });

    describe('It should respond with 400 (Bad Request) status code', () => {

        test('Case of one parameter missing', async () => {
            const obj = {
                name: 'Grrmafa',
                surname: 'Idcamcv',
                wallet: 50.30,
                address: 'Corso Duca degli Abruzzi, 21, Torino'
            };
            for (let [key,value] of Object.entries(obj)) {
                //at each iteration it will create an object with one parameter missing
                const wrongObjArray = Object.entries(obj).filter(keyValue => JSON.stringify(keyValue)!==JSON.stringify([key,value]));
                //need to convert from array to object
                const wrongObj = Object.fromEntries(wrongObjArray);
                const response = await request(app).post('/api/clients').send(wrongObj);
                expect(response.statusCode).toBe(404);
            }
        });

        test("Case of wrong 'name' parameter type", async () => {
            const response = await request(app).post('/api/clients').send({
                userid: userId1,
                name: 1,
                surname: 'Idcamcv',
                wallet: 50.30,
                address: 'Corso Duca degli Abruzzi, 21, Torino'
            });
            expect(response.statusCode).toBe(404);
        });

        test("Case of wrong 'surname' parameter type", async () => {
            const response = await request(app).post('/api/clients').send({
                userid: userId1,
                name: 'Grrmafa',
                surname: 1,
                wallet: 50.30,
                address: 'Corso Duca degli Abruzzi, 21, Torino'
            });
            expect(response.statusCode).toBe(404);
        });

        test("Case of wrong 'wallet' parameter type", async () => {
            const response = await request(app).post('/api/clients').send({
                userid: userId1,
                name: 'Grrmafa',
                surname: 'Idcamcv',
                wallet: 'a',
                address: 'Corso Duca degli Abruzzi, 21, Torino'
            });
            expect(response.statusCode).toBe(404);
        });

        test("Case of wrong 'address' parameter type", async () => {
            const response = await request(app).post('/api/clients').send({
                userid: userId1,
                name: 'Grrmafa',
                surname: 'Idcamcv',
                wallet: 'a',
                address: 1
            });
            expect(response.statusCode).toBe(404);
        });

    }); //400 status code tests

});

