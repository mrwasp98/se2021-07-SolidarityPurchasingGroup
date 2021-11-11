'use strict';

const db = require('./database');

exports.getOrderLines = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM orderline WHERE orderid=?';
        db.get(sql, [orderid], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({ error: 'Orderline not found.' });
            }
            else {
                resolve(row);
            }
        });
    });
};