'use strict';

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
        const sql = 'INSERT INTO client(userid, name, surname, wallet, address) VALUES(?,?,?,?,?)';
        db.run(sql, [client.userid, client.name, client.surname, client.wallet, client.address], function (err) {
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

//Function to subtract an amout from a client's wallet after the confirmation of the order
//antmat99
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