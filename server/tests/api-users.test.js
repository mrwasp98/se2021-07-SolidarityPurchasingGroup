'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const userDao = require('../user-dao');

jest.setTimeout(10000);

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing POST on /login', () => {

    const fakeUser1 = {
        id: 1,
        username: 'farmer1',
        password: '$2a$12$xTDtbn8cqfIqBxTUo1lMiupwpnVxbm9t3BtofQ/Yf8.cW0b1kiTB6',
        type: 'farmer'
    };

    const credentials = { 
        username: 'farmer1', 
        password: 'farmer1' 
    };


    beforeAll(async () => {
        //clear and fill (mock) client database with fakeClient1 and fakeClient2
        await userDao.deleteAllUsers();
        await userDao.insertUser(fakeUser1);
    });

    afterAll(async () => {
        await userDao.deleteAllUsers();
    });

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/login').send(credentials);
        expect(response.statusCode).toBe(200);
    });

    describe('It should respond with 401 (Unauthorized) status code', () => {

        test('Case of wrong username', async () => {
            const wrongCredentials = { 
                username: 'farmer', 
                password: 'farmer1' 
            };
            const response = await request(app).post('/login').send(wrongCredentials);
            expect(response.statusCode).toBe(401);
        });

        test('Case of wrong password', async () => {
            const wrongCredentials = { 
                username: 'farmer1', 
                password: 'farmer' 
            };
            const response = await request(app).post('/login').send(wrongCredentials);
            expect(response.statusCode).toBe(401);
        });
        
    }); //400 status code tests
});


describe('Testing DELETE on /logout', () => {

    const fakeUser1 = {
        id: 1,
        username: 'farmer1',
        password: '$2a$12$xTDtbn8cqfIqBxTUo1lMiupwpnVxbm9t3BtofQ/Yf8.cW0b1kiTB6',
        type: 'farmer'
    };

    const credentials = { 
        username: 'farmer1', 
        password: 'farmer1' 
    };


    beforeAll(async () => {
        await userDao.deleteAllUsers();
        await userDao.insertUser(fakeUser1);
    });

    afterAll(async () => {
        await userDao.deleteAllUsers();
    });

    test("It should respond with a 200 status code", async () => {
        await request(app).post('/login').send(credentials);
        const response = await request(app).delete('/logout');
        expect(response.statusCode).toBe(200);
    });

    //TODO tests in case of failure

});