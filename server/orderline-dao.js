'use strict';

const dayjs = require('dayjs');
const db = require('./database');

//Get all the rows of the orderline table
exports.getOrderLines = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM orderline WHERE orderid=?';
        db.all(sql, [orderid], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows); //the caller should manage if undefined
            }
        });
    });
};

//Insert a new row in the orderline table
exports.insertOrderLine = (line) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO orderline (orderid, productid, quantity, price) VALUES(?,?,?,?);';
        db.run(sql, [line.orderid, line.productid, line.quantity, line.price], function(err) {
            if(err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

//Get products' informations of a specific orderline given the orderid
exports.getOrderLinesWithProducts = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT p.id,p.name,o.quantity,p.measure,o.price FROM orderline AS O, product as P WHERE orderid=? AND O.productid=P.id';
        db.all(sql, [orderid], (err, rows) => {
            if (err) {
                reject(err);
            }
            if (rows == undefined) {
                resolve({ error: 'Orderline not found.' });
            }
            else {
                resolve(rows);
            }
        });
    });
};

//Delete all the rows of the orderline table
exports.deleteAllOrderlines = () => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM orderline";
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
};

/*
get orders (orderlines) related to a farmer in a date range with info on the related product
-ant
*/
exports.getOrderLinesByFarmerDateStatusWithProductInfo = (farmerid,date,status) => {
    return new Promise((resolve, reject) => {
        /*
        for the date, consider the creationdate of the order and see in what range should 'date' (the param) be.
        it should be between the previous saturday 9 am to sunday 23 pm, that is the period in which clients can
        make new orders

        Remember: dayjs has sunday as start of week and saturday as end of week

        */
        let lastSaturday9, lastSunday23;
        if(dayjs(date).format('dddd') === 'Sunday'){
            //'date' is sunday, so I take saturday9 and sunday23 from the current week
            lastSaturday9=dayjs(date).subtract(1,'day').hour(9).format('YYYY-MM-DD HH:mm');
            lastSunday23=dayjs(date).hour(23).format('YYYY-MM-DD HH:mm');
        }
        else{
            //the request is made during the week after saturday-sunday, so I take them from the previous one
            lastSaturday9=dayjs(date).startOf('week').subtract(1,'day').hour(9).format('YYYY-MM-DD HH:mm');
            lastSunday23=dayjs(date).startOf('week').hour(23).format('YYYY-MM-DD HH:mm');
        }
        let sql;
        if(status==='null') {
            sql = "SELECT ol.orderid, ol.productid, p.name, ol.quantity, p.measure, ol.price FROM 'order' AS o, orderline AS ol, product AS p WHERE o.id=ol.orderid AND ol.productid=p.id AND p.farmerid=? AND o.creationdate>=? AND o.creationdate<=? AND ol.status is NULL";
            db.all(sql, [farmerid,lastSaturday9,lastSunday23], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows); //the caller should check if undefined or not
            });
        }
        else{
            sql = "SELECT ol.orderid, ol.productid, p.name, ol.quantity, p.measure, ol.price FROM 'order' AS o, orderline AS ol, product AS p WHERE o.id=ol.orderid AND ol.productid=p.id AND p.farmerid=? AND o.creationdate>=? AND o.creationdate<=? AND ol.status=?";
            db.all(sql, [farmerid,lastSaturday9,lastSunday23,status], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows); //the caller should check if undefined or not
            });
        } 
    });
};


//change orderline status
//-ant
exports.updateOrderLineStatus = (orderid, productid, status) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE orderline SET status = ? WHERE orderid == ? AND productid == ?';
        db.run(sql, [status, orderid, productid], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(true); 
        });
    });
};

//-ant
exports.getOrderLine = (orderid,productid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM orderline WHERE orderid=? AND productid=?';
        db.get(sql, [orderid,productid], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row); //the caller should manage if undefined
        });
    });
};

//Get orderlines given a productid and a range in which the creationdate of the order they belong should be
//-ant
exports.getOrderlinesByProductOrderdate = (productid,dateMin,dateMax) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM orderline AS ol, 'order' AS o WHERE ol.orderid=o.id AND productid=? AND o.creationdate>=? AND o.creationdate<=?";
        db.all(sql, [productid,dateMin,dateMax], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows); //the caller should manage if undefined
        });
    });
};