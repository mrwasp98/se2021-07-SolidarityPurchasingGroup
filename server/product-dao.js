'use strict'

const dayjs = require('dayjs');
const db = require('./database');

exports.getProductsAvailable = (date) => {
    let thisSaturday9Am;
    let lastSaturday9Am;
    if (dayjs(date).format('dddd') !== 'Sunday') {
        thisSaturday9Am = dayjs(date).endOf('week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        lastSaturday9Am = dayjs(thisSaturday9Am).subtract(1, 'week')
    } else {
        thisSaturday9Am = dayjs(date).endOf('week').subtract(1, 'week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        lastSaturday9Am = dayjs(thisSaturday9Am).subtract(1, 'week')
    }
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM product AS P, availability AS A WHERE P.id=A.productid AND A.quantity<>0';
        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            const products = rows.map((p) => ({id: p.id, name: p.name, description: p.description, farmerid: p.farmerid, price: p.price, measure: p.measure, category: p.category, typeofproduction: p.typeofproduction, picture: p.picture, dateavailability: p.dateavailability, quantity: p.quantity}))
                            .filter((p) => {return ((dayjs(p.dateavailability)).isBefore(thisSaturday9Am) && (dayjs(p.dateavailability).isAfter(lastSaturday9Am)))});
            resolve(products);
        });
    });
};

exports.updateProductsQuantity = (productid, quantity) => {
    return new Promise((resolve, reject ) => {
        const sql = 'UPDATE availability SET quantity = quantity - ? WHERE productid == ?;';

        db.get(sql, [quantity, productid], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM product WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            if(row==undefined){
                reject({ error: 'Product not found for id ' + id });
            }
            resolve(row);
        });
    });
};

/** JUST FOR TESTS **/
exports.deleteAllProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM product';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else resolve();
        });
    });
};

exports.insertProduct = (product) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO product(id, name, description, farmerid, price, measure, category, typeofproduction, picture) VALUES(?,?,?,?,?,?,?,?,?)';
        db.run(sql, [product.id, product.name, product.description, product.farmerid, product.price, product.measure, product.category, product.typeofproduction, product.picture], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.deleteAvailability = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM availability';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else resolve();
        });
    });
};

exports.insertAvailability = (availability) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO availability(productid, dateavailability, quantity, status) VALUES(?,?,?,?)';
        db.run(sql, [availability.productid, availability.dateavailability, availability.quantity, availability.status], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

/**  JUST FOR TESTS **/