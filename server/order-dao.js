'use strict';

const db = require('./database');

exports.getOrders = (clientId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM order WHERE userid=?';
        db.get(sql, [clientId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({ error: 'Order not found.' });
            }
            else {
                resolve(row);
            }
        });
    });
};

exports.updateOrderStatus = (orderId, status) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE order SET status=? WHERE id=?';
        db.get(sql, [status, orderId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};