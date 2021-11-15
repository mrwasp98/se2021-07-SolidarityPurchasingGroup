'use-strict'

const db = require('./database');

const bcrypt = require('bcrypt');

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT * FROM user WHERE id = ?';
        db.get(sql, [id], (err,row) => {
            if(err){
                reject(err);
            }
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else{
                let user = {id: row.idS, username: row.usename, name: row.name, genAdm: row.genAdm, sgAdm: row.sgAdm}
                resolve(user);
            }
        });
    });
};

exports.getUser = (username, password) => {
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM user WHERE usename = ?';
        db.get(sql, [username], (err,row) => {
            if(err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            }
            else {
                let user = {id: row.id, username: row.usename, type: row.type};

                bcrypt.compare(password, row.password).then(result => {
                    if(result)
                        resolve(user);
                    else 
                        resolve(false);
                });
            }
        });
    });
};

/** JUST FOR THE TESTS **/
exports.deleteAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM user';
        db.run(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else resolve();
        });
    });
};

exports.insertUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user(id, usename, password, type) VALUES(?,?,?,?)';
        db.run(sql, [user.id, user.username, user.password, user.type], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};
/** JUST FOR THE TESTS **/