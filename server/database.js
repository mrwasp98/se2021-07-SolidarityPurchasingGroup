'use strict';

const sqlite = require('sqlite3');

/*
Remember to use:
'database.db' as the real database
'mock-database' as the database for tests
They must to be changed manually as the string parameter below
*/

const database = new sqlite.Database('./db/database.db', (err) => {
    if (err) throw err;
});

module.exports = database;