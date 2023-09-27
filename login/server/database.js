require('express');
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
    var sql = `SELECT * FROM credentials WHERE EMAIL = ${pool.escape(email)} and PASSWORD_HASH = SHA2(${pool.escape(password)}, 256);`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sql);
            return;
        }
        callback(results);
    });
}

function verifyMail(email, callback) {
    var sql = `SELECT USER_ID FROM credentials WHERE EMAIL = ${pool.escape(email)};`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            return;
        }
        if (!results.length) {//mail not found
            callback(1);
        }
        else { //mail found
            callback(0);
        }
    });
}

function insertUser(name, password, email, callback) {
    var sql = `INSERT INTO credentials ( USER_NAME, PASSWORD_HASH, EMAIL) VALUES(${pool.escape(name)}, 
    SHA2(${pool.escape(password)}, 256), ${pool.escape(email)})`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        callback(results);
    });
}

function updatePassword(email, password, callback) {
    var sql = `UPDATE CREDENTIALS SET PASSWORD_HASH = SHA2(${pool.escape(password)}, 256) 
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
    var sql = `SELECT post_id, topic, teacher, DATE_FORMAT(date,'%M %d, %Y') as date, 
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
    if (medium == "Online") medium = 1;
    else medium = 0;

    var sql = `INSERT INTO classes(topic, teacher, online, address, date, time) 
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

function loadPrayerTimes(location, date, callback) {
    var sql = `
            SELECT  local_time(fazr, delta) as Fazr, 
                    local_time(sunrise, delta) as Sunrise,
                    local_time(zuhr, delta) as Zuhr,
                    local_time(asr, delta) as Asr,
                    local_time(maghrib, delta) as Maghrib,
                    local_time(isha, delta) as Isha
                from
                (select * from dhaka_prayer_times, distric_prayer_time_diff
                where day_number=DAYOFYEAR(CURRENT_DATE())
                and UPPER(location)="DHAKA") T;
    `;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(results);
    });
}

module.exports = {
    checkCredentials,
    insertUser,
    verifyMail,
    updatePassword,
    loadClasses,
    insertNewClasses,
    loadPrayerTimes
}
