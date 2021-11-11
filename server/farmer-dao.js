'use strict';

const db = require('./database');

exports.getFarmers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM farmer';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};