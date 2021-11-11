'use strict';

const db = require('./database');

exports.getOrders = (clientId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM 'order' WHERE userid=?";
        db.all(sql, [clientId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows == undefined) {
                resolve({ error: 'Order not found for clientid '+clientId });
            }
            else {
                console.log(rows)
                resolve(rows);
            }
        });
    });
};

exports.updateOrderStatus = (orderId, status) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE 'order' SET status=? WHERE id=?";
        db.get(sql, [status, orderId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

exports.deleteAllOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM 'order'";
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
        });
    });
};

exports.insertOrder = (order) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO 'order'(id, userid, creationdate, claimdate, confirmationdate, deliveryaddress, status) VALUES(?,?,?,?,?,?,?)";
        db.run(sql, [order.id, order.userid, order.creationdate, order.claimdate, order.confirmationdate, order.deliveryaddress, order.status], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};
