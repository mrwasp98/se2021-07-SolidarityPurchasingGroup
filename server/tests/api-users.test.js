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
        username: 'group07@gmail.com',
        password: 'abc123',
        type: 'client'
    };

    const fakeUser2 = {
        username: 'group07-1@gmail.com',
        password: 'abc123',
        type: 'farmer'
    };

    const credentials = { 
        username: 'group07@gmail.com', 
        password: 'abc123' 
    };


    beforeAll(async () => {
        //clear and fill (mock) client database with fakeClient1 and fakeClient2
        await userDao.deleteAllUsers();
        await userDao.insertUser(fakeUser1);
        await userDao.insertUser(fakeUser2);
    });

    afterAll(async () => {
        await userDao.deleteAllUsers();

        app.close(); //without that, jest won't exit
    });

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/login').send(credentials);
        expect(response.statusCode).toBe(200);
    });

    describe('It should respond with 401 (Unauthorized) status code', () => {

        test('Case of wrong username', async () => {
            const wrongCredentials = { 
                username: 'gruop07@gmail.com', 
                password: 'abc123' 
            };
            const response = await request(app).post('/login').send(wrongCredentials);
            expect(response.statusCode).toBe(401);
        });

        test('Case of wrong password', async () => {
            const wrongCredentials = { 
                username: 'group07@gmail.com', 
                password: 'abc1234' 
            };
            const response = await request(app).post('/login').send(wrongCredentials);
            expect(response.statusCode).toBe(401);
        });
        
    }); //400 status code tests
});


describe('Testing DELETE on /logout', () => {

    const fakeUser1 = {
        username: 'farmer1@gmail.com',
        password: 'abc123',
        type: 'farmer'
    };

    const credentials = { 
        username: 'farmer1@gmail.com', 
        password: 'abc123' 
    };


    beforeAll(async () => {
        await userDao.deleteAllUsers();
        await userDao.insertUser(fakeUser1);
    });

    afterAll(async () => {
        await userDao.deleteAllUsers();

        app.close(); //without that, jest won't exit
    });

    test("It should respond with a 200 status code", async () => {
        await request(app).post('/login').send(credentials);
        const response = await request(app).delete('/logout');
        expect(response.statusCode).toBe(200);
    });

    //TODO tests in case of failure

});

describe('Testing POST on /api/shopemployee', () => {

    beforeEach(async () => {
        await userDao.deleteAllUsers();
    });

    afterEach(() => {
        userDao.deleteAllUsers();
    });

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/api/shopemployee').send({
            username:"Hari",
            password:"qwerty1",
            type:"farmer"
        })
        expect(response.statusCode).toBe(200);
    });

    describe('It should respond with 400 (Bad Request) status code', () => {

        test('Case of one parameter missing', async () => {
            const obj = {
                username:"Hari",
                password:"qwerty"
            };
            for (let [key,value] of Object.entries(obj)) {
                //at each iteration it will create an object with one parameter missing
                const wrongObjArray = Object.entries(obj).filter(keyValue => JSON.stringify(keyValue)!==JSON.stringify([key,value]));
                //need to convert from array to object
                const wrongObj = Object.fromEntries(wrongObjArray);
                const response = await request(app).post('/api/shopemployee').send(wrongObj);
                expect(response.statusCode).toBe(422);
            }
        });

        test("Case of wrong 'username' parameter type", async () => {
            const response = await request(app).post('/api/shopemployee').send({
                username:1,
                password:"qwerty1",
                type:"farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'password' parameter type", async () => {
            const response = await request(app).post('/api/shopemployee').send({
                username:"Hari",
                password:1,
                type:"farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'type' parameter type", async () => {
            const response = await request(app).post('/api/shopemployee').send({
                username:"Hari",
                password:"qwerty1",
                type:1
            });
            expect(response.statusCode).toBe(422);
        });

    }); //400 status code tests

});