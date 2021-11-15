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
                resolve(rows);
            }
        });
    });
};

exports.updateOrderStatus = (orderId, status) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE 'order' SET status=? WHERE id=?";
        db.run(sql, [status, orderId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            if(this.changes===0) resolve(false);
            else resolve(true);
        });
    });
};

exports.deleteOrder = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM 'order' WHERE id = ?;"
        db.run(sql, [orderid], (err, rows) => {
            if(err) {
                reject(err)
                return;
            }
            resolve()
        })
    })
}

exports.deleteAllOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM 'order'";
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else resolve();
        });
    });
};

exports.insertOrder = (order) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO 'order'(userid, creationdate, claimdate, confirmationdate, deliveryaddress, status) VALUES(?,?,?,?,?,?)";
        db.run(sql, [order.userid, order.creationdate, order.claimdate, order.confirmationdate, order.deliveryaddress, order.status], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};