'use strict';

const db = require('./database');

exports.getOrderLines = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM orderline WHERE orderid=?';
        db.all(sql, [orderid], (err, rows) => {
            if (err) {
                reject(err);
            }
            if (rows == undefined) {
                resolve({ error: 'Orderline not found.' });
            }
            else {
                resolve(rows);
            }
        });
    });
};

exports.insertOrderLine = (line) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO orderline (orderid, productid, quantity, price) VALUES(?,?,?,?);';
        db.run(sql, [line.orderid, line.productid, line.quantity, line.price], function(err) {
            if(err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

exports.getOrderLinesWithProducts = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT p.id,p.name,o.quantity,p.measure,o.price FROM orderline AS O, product as P WHERE orderid=? AND O.productid=P.id';
        db.all(sql, [orderid], (err, rows) => {
            if (err) {
                reject(err);
            }
            if (rows == undefined) {
                resolve({ error: 'Orderline not found.' });
            }
            else {
                resolve(rows);
            }
        });
    });
};

exports.deleteAllOrderlines = () => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM orderline";
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
};