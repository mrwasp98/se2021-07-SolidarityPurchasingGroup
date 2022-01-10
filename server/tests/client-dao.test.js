'use strict';

// we also need our app for the correct routes
const app = require("../server.js");
const clientDao = require('../client-dao');
const dayjs = require('dayjs');

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
    address: 'Corso Duca degli Abruzzi, 21, Torino',
    missed_pickups: 4,
    suspended: ''
};

describe('Testing client-dao functions unused in any api', () => {

    beforeAll(async () => {
        await clientDao.deleteAllClients();
    })

    afterEach(async () => {
        await clientDao.deleteAllClients();
    })

    afterAll(async () => {
        app.close();
    })

    test('Testing suspendClient function', async () => {
        const clientid = await clientDao.insertClient(fakeClient1);
        const result = await clientDao.suspendClient(clientid, dayjs());
        expect(result).toBe(true);
    });

    test('Testing resetMissedPickups function', async () => {
        const clientid = await clientDao.insertClient(fakeClient1);
        const result = await clientDao.resetMissedPickups(clientid);
        expect(result).toBe(true);
    });

});