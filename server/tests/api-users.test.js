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

    afterAll(async () => {
        app.close(); //without that, jest won't exit
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

describe('Testing GET on /api/usernames', () => {

    
    const fakeUser1 = {
            username: 'Henry',
            password: 'qwerty1',
            type: 'farmer'
        }

    const fakeUser2 = {
            username: 'Hari',
            password: 'abcdef1',
            type: 'client'
        }

    const fakeUser3 = {
            username: 'Hober',
            password: 'abc1234',
            type: 'shopemloyee'
        }

    let id1;
    let id2;
    let id3;

    beforeAll(async() => {
        //clear and fill (mock) farmer database with fakeFarmer1 and fakeFarmer2
        await userDao.deleteAllUsers();

        id1 = await userDao.insertUser(fakeUser1);
        id2 = await userDao.insertUser(fakeUser2);
        id3 = await userDao.insertUser(fakeUser3);

    });

    afterAll(async() => {
        //clear (mock) farmer database
        await userDao.deleteAllUsers();

        app.close(); //without that, jest won't exit
    }); 

    //remember: mock database should be pre-filled with
    //fakeProduct1 and fakeProduct2 for this method to work
    test("It should respond with an array of farmers", async () => {
        const response = await request(app).get('/api/usernames');
        const fakeUser1 = {
            id: id1,
            username: 'Henry',
            type: 'farmer'
        }
        const fakeUser2 = {
            id: id2,
            username: 'Hari',
            type: 'client'
        }
        const fakeUser3 = {
            id: id3,
            username: 'Hober',
            type: 'shopemloyee'
        }
        expect(response.body).toEqual([fakeUser1, fakeUser2, fakeUser3]);
    });

    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get('/api/usernames');
        expect(response.statusCode).toBe(200);
    });

    test("It should respond with a 404 status code", async () => {
        const response = await request(app).get('/api/username');
        expect(response.statusCode).toBe(404);
    });

});

describe('Testing POST on /api/farmer', () => {

    beforeAll(() => {
        userDao.deleteAllUsers();
    });

    afterEach(() => {
        userDao.deleteAllUsers();
    });

    afterAll(()=>{
        app.close(); //without that, jest won't exit
    })

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/api/farmer').send({
            username: "Harry01",
            password: "qwerty1",
            name: "Harry", 
            surname: "Potter",
            place: "Hogwarts",
            address: "Private Drive",
            type: "farmer"
        })
        expect(response.statusCode).toBe(200);
    });

    describe('It should respond with 400 (Bad Request) status code', () => {

        test('Case of one parameter missing', async () => {
            const obj = {
                username: "Harry01",
                password: "qwerty1",
                name: "Harry", 
                place: "Hogwarts",
                address: "Private Drive",
                type: "farmer"
            };
            for (let [key,value] of Object.entries(obj)) {
                //at each iteration it will create an object with one parameter missing
                const wrongObjArray = Object.entries(obj).filter(keyValue => JSON.stringify(keyValue)!==JSON.stringify([key,value]));
                //need to convert from array to object
                const wrongObj = Object.fromEntries(wrongObjArray);
                const response = await request(app).post('/api/farmer').send(wrongObj);
                expect(response.statusCode).toBe(422);
            }
        });

        test("Case of wrong 'username' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                username: 0,
                password: "qwerty1",
                name: "Harry", 
                surname: "Potter",
                place: "Hogwarts",
                address: "Private Drive",
                type: "farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'password' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                username: "Harry01",
                password: 1,
                name: "Harry", 
                surname: "Potter",
                place: "Hogwarts",
                address: "Private Drive",
                type: "farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'name' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                username: "Harry01",
                password: "qwerty1",
                name: 2, 
                surname: "Potter",
                place: "Hogwarts",
                address: "Private Drive",
                type: "farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'surname' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                username: "Harry01",
                password: "qwerty1",
                name: "Harry", 
                surname: 3,
                place: "Hogwarts",
                address: "Private Drive",
                type: "farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'place' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                username: "Harry01",
                password: "qwerty1",
                name: "Harry", 
                surname: "Potter",
                place: 4,
                address: "Private Drive",
                type: "farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'place' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                username: "Harry01",
                password: "qwerty1",
                name: "Harry", 
                surname: "Potter",
                place: "Hogwarts",
                address: 5,
                type: "farmer"
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'type' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                username: "Harry01",
                password: "qwerty1",
                name: "Harry", 
                surname: "Potter",
                place: "Hogwarts",
                address: "Private Drive",
                type: 5
            });
            expect(response.statusCode).toBe(422);
        });

    }); //400 status code tests

});

describe('Testing POST on /api/password', () => {

    let idU;

    const fakeUser1 = {
        username: 'Henry',
        password: 'qwerty1',
        type: 'client-prov'
    }

    beforeAll(async () => {
        await userDao.deleteAllUsers();
        idU = await userDao.insertUser(fakeUser1)
    });

    afterEach(() => {
        userDao.deleteAllUsers();
    });

    afterAll(()=>{
        app.close(); //without that, jest won't exit
    })

    test('It should respond with 200 status code', async () => {
        const response = await request(app).post('/api/password').send({
            id: idU,
            password: "qwerty1",
        })
        expect(response.statusCode).toBe(200);
    });

    describe('It should respond with 400 (Bad Request) status code', () => {

        test('Case of one parameter missing', async () => {
            const obj = {
                password: "qwerty1",
            };
            for (let [key,value] of Object.entries(obj)) {
                //at each iteration it will create an object with one parameter missing
                const wrongObjArray = Object.entries(obj).filter(keyValue => JSON.stringify(keyValue)!==JSON.stringify([key,value]));
                //need to convert from array to object
                const wrongObj = Object.fromEntries(wrongObjArray);
                const response = await request(app).post('/api/farmer').send(wrongObj);
                expect(response.statusCode).toBe(422);
            }
        });

        test("Case of wrong 'id' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                id: "1",
                password: "qwerty1",
            });
            expect(response.statusCode).toBe(422);
        });

        test("Case of wrong 'password' parameter type", async () => {
            const response = await request(app).post('/api/farmer').send({
                id: idU,
                password: 1,
            });
            expect(response.statusCode).toBe(422);
        });

    }); //400 status code tests

});