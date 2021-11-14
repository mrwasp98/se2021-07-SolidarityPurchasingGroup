'use strict';

const db = require('./database');

exports.getFarmers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT place,userId FROM farmer';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};