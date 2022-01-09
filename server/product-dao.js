'use strict'

const dayjs = require('dayjs');
const db = require('./database');

//Get all the available products in a specified date
exports.getDeliveredProducts = (date) => {
    let lastSaturday9Am;
    let lastlastSaturday9Am;
    if (dayjs(date).format('dddd') !== 'Sunday') {
        lastSaturday9Am = dayjs(date).endOf('week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        lastlastSaturday9Am = dayjs(lastSaturday9Am).subtract(1, 'week')
    } else {
        lastSaturday9Am = dayjs(date).endOf('week').subtract(1, 'week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        lastlastSaturday9Am = dayjs(lastSaturday9Am).subtract(1, 'week')
    }
   lastSaturday9Am = lastSaturday9Am.subtract(1,'week').add(1,'day').format('YYYY-MM-DD')
   lastlastSaturday9Am = lastlastSaturday9Am.subtract(1,'week').format('YYYY-MM-DD')
   //console.log(lastlastSaturday9Am,"---", lastSaturday9Am)

    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT(P.farmerid) FROM product AS P, availability AS A WHERE P.id=A.productid AND A.status="delivered" AND A.dateavailability>? AND A.dateavailability<=?';
        db.all(sql, [lastlastSaturday9Am, lastSaturday9Am], (err, rows) => {
            if (err) {
                reject(err);
            }
            const farmersId = rows.map((p) => ({ farmerid: p.farmerid}))
            console.log(farmersId)
            console.log("ciaoooooo")
            resolve(farmersId);
        });
    });
};

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
   thisSaturday9Am = thisSaturday9Am.add(1,'day').format('YYYY-MM-DD')
   lastSaturday9Am = lastSaturday9Am.format('YYYY-MM-DD')

    console.log(thisSaturday9Am,"---", lastSaturday9Am)

    return new Promise((resolve, reject) => {
        const sql = 'SELECT P.id, P.name, P.description, P.farmerid, A.price, P.measure, P.category, P.typeofproduction, P.picture, A.dateavailability, A.quantity, A.status FROM product AS P, availability AS A WHERE P.id=A.productid AND A.quantity<>0 AND A.dateavailability>? AND A.dateavailability<=?';
        db.all(sql, [lastSaturday9Am, thisSaturday9Am], (err, rows) => {
            if (err) {
                reject(err);
            }
            const products = rows.map((p) => ({ id: p.id, name: p.name, description: p.description, farmerid: p.farmerid, price: p.price, measure: p.measure, category: p.category, typeofproduction: p.typeofproduction, picture: p.picture, dateavailability: p.dateavailability, quantity: p.quantity }))
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
    let lastSaturday9Am;
    let previewsSaturday9Am;
    if (dayjs(date).format('dddd') == 'Saturday') {
        lastSaturday9Am = dayjs(date).endOf('day').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        previewsSaturday9Am = dayjs(lastSaturday9Am).subtract(1, 'week')
    } else if (dayjs(date).format('dddd') == 'Sunday'){
        lastSaturday9Am = dayjs(date).endOf('day').subtract(1, 'day').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        previewsSaturday9Am = dayjs(lastSaturday9Am).subtract(1, 'week')
    } else if (dayjs(date).format('dddd') == 'Monday'){
        lastSaturday9Am = dayjs(date).endOf('day').subtract(2, 'day').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        previewsSaturday9Am = dayjs(lastSaturday9Am).subtract(1, 'week')
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
                .filter((p) => { return ((dayjs(p.dateavailability)).isBefore(lastSaturday9Am) && (dayjs(p.dateavailability).isAfter(previewsSaturday9Am))) });
            resolve(products);
        });
    });
};