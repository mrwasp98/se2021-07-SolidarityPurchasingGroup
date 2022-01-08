'use strict';

const db = require('./database');

//Get all rows of the order table
exports.getOrders = (clientId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM 'order' WHERE userid=?";
        db.all(sql, [clientId], (err, rows) => {
            if (err) {
                reject(err);
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

/*
I've split this method because we need it below and we can't use it if it's exported
*/
//Update the order status
exports.updateOrderStatus = (orderId, status) => {
    return privateUpdateOrderStatus(orderId,status);
};

const privateUpdateOrderStatus= (orderId, status) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE 'order' SET status=? WHERE id=?";
        db.run(sql, [status, orderId], (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};

//Delete a row of the table order given the orderid
exports.deleteOrder = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM 'order' WHERE id = ?;"
        db.run(sql, [orderid], (err, rows) => {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
} 

//Delete all the rows from the order table
exports.deleteAllOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM 'order'";
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else resolve();
        });
    });
};

//Insert a new row in the order table
exports.insertOrder = (order) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO 'order'(userid, creationdate, claimdate, confirmationdate, deliveryaddress, status) VALUES(?,?,?,?,?,?)";
        db.run(sql, [order.userid, order.creationdate, order.claimdate, order.confirmationdate, order.deliveryaddress, order.status], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};

//Get a row of the order table given the orderid
exports.getOrder = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM 'order' WHERE id=?";
        db.get(sql, [orderid], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row); //the caller should check if it is undefined or not
        });
    });
};

//Get all the orders havin a specifc status
exports.getOrdersByStatus = (status) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM 'order' WHERE status=?";
        db.all(sql, [status], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows); //the caller should check if it is undefined or not
        });
    });
};

/*
TODO test
given a status, it checks (and in case does it) if the order status must be changed
ex. if the passed status is "confirmed" it checks if all orderlines are "confirmed": if so it updates the order status
-ant
*/
exports.checkForStatusUpdate = async (orderid,status) => {
    //add other status when needed
    switch(status){
        case 'packaged':{
            //if all orderlines are packaged, the order should result as packaged
            if(await allOrderlinesHaveStatus(orderid,'packaged')){
                await privateUpdateOrderStatus(orderid,'packaged');
            } 
        }break;
        case 'failed':{
            //if an orderline fails, the order should fail
            await privateUpdateOrderStatus(orderid,'failed');
        }
        case 'confirmed':{
            //if all orderlines are confirmed, the order should result as confirmed
            if(await allOrderlinesStatus(orderid,'confirmed')) {
                await privateUpdateOrderStatus(orderid,'confirmed'); 
                //TODO trigger wallet decrement (use function in client-dao)
            }
        };break;
        default:{
            //TODO
        }
    }
};

/*
TODO test
Returns true iff all orderlines of the order 'orderid' have the status 'status'
-ant
*/
const allOrderlinesHaveStatus = async (orderid,status) => {
    return await countOrderLines(orderid) === await countOrderLinesWithStatus(orderid,status);
}

/*
TODO test
"How many orderlines does this order have?"
Counts the number of orderlines related to an order
-ant
*/
const countOrderLines = (orderid) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) FROM orderline WHERE orderid=?";
        db.get(sql, [orderid], function (err,res) {
            if (err) {
                reject(err);
            }
            resolve(res['COUNT(*)']);
        });
    });
};

/*
TODO test
"How many orderlines with a certain status does this order have?"
Counts the number of orderlines with a certain status related to an order
-ant
*/
const countOrderLinesWithStatus = (orderid,status) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) FROM orderline WHERE orderid=? AND status=?";
        db.get(sql, [orderid,status], function (err,res) {
            if (err) {
                reject(err);
            }
            resolve(res['COUNT(*)']);
        });
    });
};
