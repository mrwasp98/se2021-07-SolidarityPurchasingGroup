'use-strict'

const db = require('./database');

const bcrypt = require('bcrypt');

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT * FROM STUDENTS WHERE idS = ?';
        db.get(sql, [id], (err,row) => {
            if(err){
                reject(err);
            }
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else{
                let user = {id: row.idS, username: row.email, name: row.name, genAdm: row.genAdm, sgAdm: row.sgAdm}
                resolve(user);
            }
        });
    });
};

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM STUDENTS WHERE email = ?';
        db.get(sql, [email], (err,row) => {
            if(err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            }
            else {
                let user = {id: row.idS, username: row.email, name: row.name, genAdm: row.genAdm, sgAdm: row.sgAdm};

                bcrypt.compare(password, row.hash).then(result => {
                    if(result)
                        resolve(user);
                    else 
                        resolve(false);
                });
            }
        });
    });
};