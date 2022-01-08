'use strict'

const dayjs = require('dayjs');
const db = require('./database');

//Get all the available products in a specified date
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
        const sql = 'SELECT P.id, P.name, P.description, P.farmerid, P.price, P.measure, P.category, P.typeofproduction, P.picture, A.dateavailability, A.quantity, A.status FROM product AS P, availability AS A WHERE P.id=A.productid AND A.quantity<>0';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            const products = rows.map((p) => ({ id: p.id, name: p.name, description: p.description, farmerid: p.farmerid, price: p.price, measure: p.measure, category: p.category, typeofproduction: p.typeofproduction, picture: p.picture, dateavailability: p.dateavailability, quantity: p.quantity }))
                .filter((p) => { return ((dayjs(p.dateavailability)).isBefore(thisSaturday9Am) && (dayjs(p.dateavailability).isAfter(lastSaturday9Am))) });
            resolve(products);
        });
    });
};

//Get all the products of a famrmer
exports.getProductsByFarmer = (farmerid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM product AS P WHERE P.farmerid = ?';
        db.all(sql, [farmerid], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

//Update the quantity field of a product
exports.updateProductsQuantity = (productid, quantity) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE availability SET quantity = quantity - ? WHERE productid == ?;';
        db.get(sql, [quantity, productid], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
};


//Get informations about a product given his id
exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM product WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row); //could be undefined
        });
    });
};

/** JUST FOR TESTS **/

//Delete all products from the DB
exports.deleteAllProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM product';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
};

//Insert a new product in the product table (for the story 9)
exports.insertProduct = (product) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO product(name, description, farmerid, price, measure, category, typeofproduction, picture) VALUES(?,?,?,?,?,?,?,?)';
        db.run(sql, [product.name, product.description, product.farmerid, product.price, product.measure, product.category, product.typeofproduction, product.picture], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

//edit a product in the product table (for the story 9)
exports.updateProduct = (product) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE product SET name = ?, description = ?, farmerid = ?, measure = ?, category = ?, typeofproduction = ?, picture = ? WHERE id == ?;';
        db.run(sql, [product.name, product.description, product.farmerid, product.measure, product.category, product.typeofproduction, product.picture, product.id], function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

//delete a product in the product table (for the story 9)
exports.deleteProduct = (productid) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM product WHERE id = ?';
        db.run(sql, [productid], function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};


//Delete everiting from the availability table (This daos are made just for the tests)
exports.deleteAvailability = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM availability';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
};

//Insert a new row in the availability rable (for the story 9)
exports.insertAvailability = (availability) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO availability(productid, dateavailability, quantity, status, price, initial_quantity) VALUES(?,?,?,?,?,?)';
        db.run(sql, [availability.productid, availability.dateavailability, availability.quantity, availability.status, availability.price, availability.quantity], function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

//Get products unretrieved in a certain week
exports.getUnretrievedProducts = (beginDate, endDate) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT ol.productid, p.name, ol.quantity, p.measure, f.name AS 'farmerName', f.surname AS 'farmerSurname' FROM 'order' AS o, orderline AS ol, product AS p, farmer AS f WHERE o.id=ol.orderid AND ol.productid=p.id AND f.userid=p.farmerid AND o.status='unretrieved' AND o.claimdate>=? AND o.claimdate<=?";
        db.all(sql, [beginDate, endDate], (err, rows) => {
            if (err) {
                console.log(err)
                reject(err);
            }
            //sum quantities of the same product
            const ret = sumQuantitiesOfSameProduct(rows);
            resolve(ret);
        });
    });
};

const sumQuantitiesOfSameProduct = (products) => {
    const ret = [];
    for(let i=0;i<products.length;i++) {
        if (!alreadySeen(products[i], ret)) {
            let sum = 0;
            for (let j=i;j<products.length;j++) {
                if (products[j].productid === products[i].productid) {
                    sum += products[j].quantity;
                }
            }
            ret.push({
                productid: products[i].productid,
                name: products[i].name,
                quantity: sum,
                measure: products[i].measure,
                farmerName:products[i].farmerName,
                farmerSurname:products[i].farmerSurname
            })
        }//if
    }
    return ret;
}

const alreadySeen = (product,productList) => {
    for(let p of productList)
        if(p.productid===product.productid) return true;
    return false;
}

//Get products availability
exports.getProductsAvailability = (farmerid, date) => {
    let thisSaturday9Am;
    let lastSaturday9Am;
    if (dayjs(date).format('dddd') !== 'Sunday') {
        thisSaturday9Am = dayjs(date).endOf('week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        lastSaturday9Am = dayjs(thisSaturday9Am).subtract(1, 'week')
    } else {
        thisSaturday9Am = dayjs(date).endOf('week').subtract(1, 'week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        lastSaturday9Am = dayjs(thisSaturday9Am).subtract(1, 'week')
    }
    const status = 'pending';
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM availability as A, product as P WHERE A.productid=P.id AND P.farmerid=? AND A.status=?";
        db.all(sql, [farmerid, status], (err, rows) => {
            if (err) {
                console.log(err)
                reject(err);
            }
            const products = rows.map((p) => ({ productid: p.productid, productName: p.name, dateavailability: p.dateavailability, quantity: p.initial_quantity, measure: p.measure, status: p.status, price: p.price}))
                .filter((p) => { return ((dayjs(p.dateavailability)).isBefore(thisSaturday9Am) && (dayjs(p.dateavailability).isAfter(lastSaturday9Am))) });
            resolve(products);
        });
    });
};