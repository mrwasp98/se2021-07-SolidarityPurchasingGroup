'use strict';

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");
const farmerDao = require('../farmer-dao');

/*
REMEMBER
Change the database in database.js before running tests
*/

describe('Testing GET on /api/farmers', () => {

    
    const fakeFarmer1 = {
            userid: 1,
            name: 'Henry',
            surname: 'Jekyll',
            place: 'Cooperativa di Dr. Jekyll',
            address: 'Via Trotta, 3, Torino, TO'
        }
    const fakeFarmer2 = {
            userid: 2,
            name: 'Edward',
            surname: 'Hyde',
            place: 'Azienda Agricola di Mr. Hyde',
            address: 'Str. Val Chiapini, 70, Torino, TO'
        }

    beforeAll(async() => {
        //clear and fill (mock) farmer database with fakeFarmer1 and fakeFarmer2
        await farmerDao.deleteAllFarmers();

        await farmerDao.insertFarmer(fakeFarmer1);
        await farmerDao.insertFarmer(fakeFarmer2);

    });

    afterAll(async() => {
        //clear (mock) farmer database
        await farmerDao.deleteAllFarmers();

        app.close(); //without that, jest won't exit
    }); 

    //remember: mock database should be pre-filled with
    //fakeProduct1 and fakeProduct2 for this method to work
    test("It should respond with an array of farmers", async () => {
        const response = await request(app).get('/api/farmers');
        const fakeFarmer1 = {
            userid: 1,
            place: 'Cooperativa di Dr. Jekyll'
        }
        const fakeFarmer2 = {
            userid: 2,
            place: 'Azienda Agricola di Mr. Hyde'
        }
        expect(response.body).toEqual([fakeFarmer1, fakeFarmer2]);
    });

    test("It should respond with a 200 status code", async () => {
        const response = await request(app).get('/api/farmers');
        expect(response.statusCode).toBe(200);
    });

    test("It should respond with a 404 status code", async () => {
        const response = await request(app).get('/api/farmer');
        expect(response.statusCode).toBe(404);
    });
 
});