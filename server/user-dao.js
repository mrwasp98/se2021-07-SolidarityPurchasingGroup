'use-strict'

const db = require('./database');

const bcrypt = require('bcrypt');
const saltRounds = 10;

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

exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            if (rows == undefined) {
                resolve({ error: 'Users not found'});
            }
            else {
                const usernames = rows.map((u) => ({username: u.usename, id: u.id, type: u.type}))
                resolve(usernames)
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
            }
            else resolve();
        });
    });
};

exports.insertUser =  (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user(usename, password, type) VALUES(?,?,?)';
        const hash = bcrypt.hashSync(user.password, saltRounds);
        db.run(sql, [user.username, hash , user.type], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
};
/** JUST FOR THE TESTS **/

exports.updatePassword = (password, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user SET password=? WHERE id == ?';
        const hash = bcrypt.hashSync(password, saltRounds);
        db.run(sql, [hash, id], function (err) {
            if (err) {
                reject(err);
            }
            if (this.changes === 0) resolve(false);
            else resolve(true);
        });
    });
};

exports.updateType= (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user SET type=? WHERE id == ?';
        db.run(sql, ["client", id], function (err) {
            if (err) {
                reject(err);
            }
            if (this.changes === 0) resolve(false);
            else resolve(true);
        });
    });
};