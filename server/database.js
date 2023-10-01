const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'system',
    database: 'ibadah',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

function checkCredentials(email, password, callback) {
    const sql = `SELECT * FROM credentials WHERE EMAIL = ${pool.escape(email)} and PASSWORD_HASH = SHA2(${pool.escape(password)}, 256);`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sql);
            return;
        }
        callback(results);
    });
}

function verifyMail(email, callback) {

    let MAIL_HAS_BEEN_FOUND= true

    const sql = `SELECT USER_ID FROM credentials WHERE EMAIL = ${pool.escape(email)};`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            MAIL_HAS_BEEN_FOUND = false;
        }
        if (!results.length) {//mail not found
            MAIL_HAS_BEEN_FOUND = false;
        }
        callback(MAIL_HAS_BEEN_FOUND)
    });
}

function insertUser(name, password, email, callback) {
    const sql = `INSERT INTO credentials ( USER_NAME, PASSWORD_HASH, EMAIL) VALUES(${pool.escape(name)}, 
    SHA2(${pool.escape(password)}, 256), ${pool.escape(email)})`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        callback(results);
    });
}

function updatePassword(email, password, callback) {
    const sql = `UPDATE CREDENTIALS SET PASSWORD_HASH = SHA2(${pool.escape(password)}, 256) 
        WHERE EMAIL = ${pool.escape(email)}`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function loadClasses(callback) {
    const sql = `SELECT post_id, topic, teacher, DATE_FORMAT(date,'%M %d, %Y') as date, 
                TIME_FORMAT(time,'%h:%i %p') as time, online, address FROM classes 
                order by post_id desc`;


    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(results);
    });
}

function insertNewClasses(topic, teacher, medium, address, date, time, callback) {
    if (medium === "Online") medium = 1;
    else medium = 0;

    const sql = `INSERT INTO classes(topic, teacher, online, address, date, time) 
                VALUES (${pool.escape(topic)}, ${pool.escape(teacher)}, ${pool.escape(medium)}, 
                        ${pool.escape(address)}, ${pool.escape(date)}, ${pool.escape(time)})`;
    pool.query(sql, (err) => {
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
    updatePassword,
    loadClasses,
    insertNewClasses
}
