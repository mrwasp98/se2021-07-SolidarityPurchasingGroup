'use strict';

const dayjs = require('dayjs');
const db = require('./database');

//Get all the rows of the client table
exports.getClients = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM client';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

//Delete all the rows of the client table
exports.deleteAllClients = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM client';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
};

//Insert a new client in the client table
exports.insertClient = (client) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO client(userid, name, surname, wallet, address, missed_pickups, suspended) VALUES(?,?,?,?,?,0,?)';
        db.run(sql, [client.userid, client.name, client.surname, client.wallet, client.address, client.suspended], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

//Add an ammount to the specified client's wallet 
exports.topUp = (clientid, ammount) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE client SET wallet = wallet + ? WHERE userid == ?';
        db.run(sql, [ammount, clientid], function (err) {
            if (err) {
                reject(err);
            }
            if (this.changes === 0) resolve(false);
            else resolve(true);
        });
    });
};

//Increment the counter of missed_pickups
exports.incrementMissedPickups = (clientid,quantity) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE client SET missed_pickups = missed_pickups + ? WHERE userid == ?';
        db.run(sql, [quantity,clientid], function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

//Get a client from client table by hi id
exports.getClientById = (clientid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM client WHERE userid=?';
        db.get(sql, [clientid], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row); //manage in server.js in row is undefined or not
        });
    });
};

//Get client's missed pickups
exports.getClientMissedPickups = (clientid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT missed_pickups FROM client WHERE userid=?';
        db.get(sql, [clientid], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row); //manage in server.js in row is undefined or not
        });
    });
};

//Function to subtract an amout from a client's wallet after the confirmation of the order
//-ant
exports.subtractFromWallet = (clientid, amount) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE client SET wallet = wallet - ? WHERE userid == ?';
        db.run(sql, [amount, clientid], function (err) {
            if (err) {
                reject(err);
            }
            if (this.changes === 0) resolve(false);
            else resolve(true);
        });
    });
};


//Add a date at the suspended field of the client table
exports.suspendClient = (clientid, today) => {
    return new Promise((resolve, reject) => {
        const date = dayjs(today).add(1, 'month').format('YYYY-MM-DD');
        const sql = 'UPDATE client SET suspended = ? WHERE userid == ?';
        db.run(sql, [date, clientid], function (err) {
            if (err) {
                reject(err);
            }
            if (this.changes === 0) resolve(false);
            else resolve(true);
        });
    });
};

//Reset the counter of missed_pickups
exports.resetMissedPickups = (clientid) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE client SET missed_pickups = 0 WHERE userid == ?';
        db.run(sql, [clientid], function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

//Get suspended date
exports.getClientSuspendedDate = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT C.suspended FROM client C, user U WHERE U.id=C.userid AND usename = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row); 
        });
    });
};

//get client's wallet amount
exports.getWallet = (clientid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT wallet FROM client WHERE userid=?';
        db.get(sql, [clientid], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row.wallet); 
        });
    });
};