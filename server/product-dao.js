'use strict'

const dayjs = require('dayjs');

const db = require('./database');

exports.getProductsAvailable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM product AS P, availability AS A WHERE P.id=A.productid';
        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            const products = rows.map((p) => ({id: p.id, name: p.name, description: p.description, farmerid: p.farmerid, price: p.price, measure: p.measure, category: p.category, typeofproduction: p.typeofproduction, picture: p.picture, dateavailability: p.dateavailability, quantity: p.quantity}))
                            .filter((p) => {return ((dayjs(p.dateavailability)).isBefore(dayjs().format("YYYY-MM-DD")) || (dayjs(p.dateavailability).format("YYYY-MM-DD")) === (dayjs().format("YYYY-MM-DD")))});
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


    })
}

exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM product WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if(err) {
                reject(err);
                return;
            }
            if(row==undefined){
                resolve({ error: 'Product not found for id '+id });
            }
            resolve(row);
        });
    });
};