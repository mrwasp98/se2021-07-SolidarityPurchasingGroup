'use strict';

const db = require('./database');

exports.getFarmers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT place, userId FROM farmer';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

/**  JUST FOR TESTS **/

exports.deleteAllFarmers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM farmer';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
};

exports.insertFarmer = (farmer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO farmer(userid, name, surname, place, address) VALUES(?,?,?,?,?)';
        db.run(sql, [farmer.userid, farmer.name, farmer.surname, farmer.place, farmer.address], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

/**  JUST FOR TESTS **/