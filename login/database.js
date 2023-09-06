const { response } = require('express');
const mysql = require('mysql');
const fs = require('fs');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'dbms',
  database: 'ibadah',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function checkCredentials(email, password, callback) {
    var sql = `SELECT * FROM credentials WHERE EMAIL = ${pool.escape(email)} and PASSWORD_HASH = SHA2(${pool.escape(password)},256);`;
    pool.query(sql, (err, results, fields) => { 
        if (err) {
            console.log(err.sql);
            return;
        }
        callback(results);
    });
}

function verifyMail(email, callback) {
    var sql = `SELECT USER_ID FROM credentials WHERE EMAIL = ${pool.escape(email)};`;
    pool.query(sql, (err, results, fields) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            return ;
        }
        if(!results.length) {
            console.log('Email already used');
            callback(0, 1); //failure
        }
        else {
            // console.log('Email not found');
            console.log(results);
            callback(results[0].USER_ID, 0); //success
        }
    });
}

function insertUser(name, password, email, callback) {
    var sql = `INSERT INTO credentials ( USER_NAME, PASSWORD_HASH, EMAIL) VALUES(${pool.escape(name)}, 
    SHA2(${pool.escape(password)}, 256), ${pool.escape(email)})`;
    pool.query(sql, (err, results, fields) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        callback(results);
    });
}

function updatePassword(user_id, password, callback) {
    var sql = `UPDATE CREDENTIALS SET PASSWORD_HASH = SHA2(${pool.escape(password)}, 256) 
        WHERE USER_ID = ${pool.escape(user_id)}`;
    pool.query(sql, (err, results, fields) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

module.exports = {
    checkCredentials,
    insertUser,
    verifyMail,
    updatePassword
}
