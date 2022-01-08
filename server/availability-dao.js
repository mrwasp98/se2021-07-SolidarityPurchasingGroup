'use strict'

const dayjs = require('dayjs');
const db = require('./database');

//Get the inormation af available products given the farmer id
exports.getProductAvailabilityByIdFarmer = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM availability A, product P WHERE P.id = A.productid AND P.farmerid = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row == undefined) {
                reject({ error: 'Product of the farmer not found for id ' + id });
            }
            resolve(row);
        });
    });
};

//Insert a new row in the availability table
exports.insertEstimateAvailabilityProdcut = (productid, dateAvailability, price, quantity) => {
    return new Promise((resolve, reject) => {
        const STATUS = "estimated"
        const sql = 'INSERT INTO availability(productid, dateavailability, price, quantity, status, initial_quantity) ' +
            ' VALEUS(?,?,?,?,?); ';

        db.run(sql, [productid, dateAvailability, price, quantity, STATUS, quantity], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        })
    })
}

//Update the status field of the availability table
exports.updateStatusAvailabilityProduct = (productid, dateAvailability) => {
    return new Promise((resolve, reject) => {
        const STAUTS = "ok";
        const sql = ' UPDATE availabiliy SET status = ? WHERE productid = ? AND dateAvailability = ?; ';

        db.get(sql, [STAUTS, productid, dateAvailability], (err, row) => {
            if (err)
                reject(err);
            resolve(row);
        });
    });
}

//Update the quantity field of the availability table given the product id and the date of availability
exports.updateQuantityAvailabilityProduct = (productid, dateAvailability, quantity) => {
    return new Promise((resolve, reject) => {
        const sql = ' UPDATE availabiliy SET quantity = ? WHERE productid = ? AND dateAvailability = ?; ';

        db.get(sql, [quantity, productid, dateAvailability], (err, row) => {
            if (err)
                reject(err);
            resolve(row)
        });
    });
}

//Delete a row from availability given the product id and the date of availability
exports.deleteAvailabilityProduct = (productid, dateAvailability) => {
    return new Promise((resolve, reject) => {
        const sql = ' DELETE FROM availability WHERE productid = ? AND dateAvailability = ?; ';

        db.run(sql, [productid, dateAvailability], (err, row) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
}

// Fix the price
exports.getEffectivePriceofProduct = (productid, dateAvailability) => {
    return new Promise((resolve, reject) => {
        const sql = ' SELECT price ' +
            ' FROM availability ' +
            ' WHERE productid = ? AND ' +
            ' dateavailability = ?; ';

        db.get([productid, dateAvailability], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}