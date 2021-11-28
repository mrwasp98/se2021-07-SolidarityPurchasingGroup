'use strict';

// we also need our app for the correct routes
const app = require("../server.js");
const userDao = require('../user-dao');
const { getUserById } = require("../user-dao.js");

jest.setTimeout(10000);

/*
REMEMBER
Change the database in database.js before running tests
*/

const fakeUser1 = {
    username: 'group07@gmail.com',
    password: 'abc123',
    type: 'client'
};

describe('Testing user-dao functions unused in any api', () => {

    beforeAll(async () => {
        await userDao.deleteAllUsers();
    })

    afterEach(async () => {
        await userDao.deleteAllUsers();
    })

    afterAll(async () => {
        app.close();
    })

    test('Testing getUserById function', async () => {
        const id = await userDao.insertUser(fakeUser1);
        const user = await getUserById(id);
        expect([user.username,user.name]).toStrictEqual([fakeUser1.username,fakeUser1.name]);
    });

});