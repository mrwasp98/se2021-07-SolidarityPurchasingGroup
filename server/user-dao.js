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