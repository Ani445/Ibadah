const { response } = require('express');
const mysql = require('mysql');
const fs = require('fs');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'system',
  database: 'ibadah',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});





function checkCredentials(name, password) {
    var sql = `SELECT USER_ID FROM credentials WHERE USER_NAME = ${pool.escape(name)} and PASSWORD_HASH = SHA2(${pool.escape(password)},256);`;
    pool.query(sql, (err, results, fields) => { 
        if (err) {
            console.log(err);
            return;
        }
        if(results.length) {
            fs.writeFile('./user.json', JSON.stringify(results[0]), (err) => {
                if(err) {
                    console.log('error writing in file');
                }
            });
            console.log('login successful');
        }
        else {
            console.log('Invalid username or password');
        }
    });
}

function verifyMail(email) {
    var sql = `SELECT USER_ID FROM credentials WHERE USER_NAME = ${pool.escape(email)};`;
    pool.query(sql, (err, results, fields) => {
        if (err) {
            console.log(err);
            return;
        }
        if(results.length) {
            console.log('Email already used');
        }
        else {
            console.log('Email not found');
            console.log(results);
        }
    });
}

function insertUser(name, password, email, callback) {
    var sql = `INSERT INTO credentials ( USER_NAME, PASSWORD_HASH, EMAIL) VALUES(${pool.escape(name)}, 
    SHA2(${pool.escape(password)}, 256), ${pool.escape(email)})`;
    pool.query(sql, (err, results, fields) => {
        if (err) {
            console.log(err);
            callback(0);
        }
        else callback(1);
    });
}

module.exports = {
    checkCredentials,
    insertUser,
    verifyMail
}
