const mysql = require('mysql');
const {user} = require('./database-objects')

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
    const sqlCredentials = `SELECT *
                            FROM credentials
                            WHERE EMAIL = ${pool.escape(email)}
                              and PASSWORD_HASH = SHA2(${pool.escape(password)}, 256);`;

    const sqlProfile = `SELECT *
                        FROM PROFILE
                        WHERE USER_ID = ?`;

    pool.query(sqlCredentials, (err, results) => {
        if (err) {
            return console.log(err.sql);
        }
        if (!results.length) {
            if (callback) return callback(0);
        }
        ({USER_ID: user.userID, EMAIL: user.email} = results[0]);
        pool.query(sqlProfile, results[0].USER_ID, (err, results) => {
            if (err) {
                return console.log(err.sql);
            }
            const {GENDER, COUNTRY, FIRST_NAME, LAST_NAME} = results[0];
            user.userName = FIRST_NAME + (LAST_NAME ? LAST_NAME : "");
            user.gender = GENDER === 0 || null ? "Female" : "Male"
            user.country = COUNTRY
            if (callback) callback(1);
        });
    });
}

function verifyMail(email, callback) {

    let MAIL_HAS_BEEN_FOUND = true

    const sql = `SELECT USER_ID
                 FROM credentials
                 WHERE EMAIL = ${pool.escape(email)};`;
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
    const sqlCredentials = `INSERT INTO credentials (EMAIL, PASSWORD_HASH)
                            VALUES (${pool.escape(email)},
                                    SHA2(${pool.escape(password)}, 256))`;

    const sqlProfile = `INSERT INTO profile (USER_ID, FIRST_NAME)
                        VALUES (?,
                                ${pool.escape(name)})`;

    pool.query(sqlCredentials, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            if (callback) return callback(err)
        } else {
            pool.query(sqlProfile, results.insertId, (err) => {
                if (err) {
                    console.log(err.sqlMessage + '\n' + err.sql);
                }
                if (callback) return callback(err)
            })
        }
    });
}

function updatePassword(email, password, callback) {
    const sql = `UPDATE CREDENTIALS
                 SET PASSWORD_HASH = SHA2(${pool.escape(password)}, 256)
                 WHERE EMAIL = ${pool.escape(email)}`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function updatePersonalInfo(userID, name, gender, country, callback) {
    name = pool.escape(name)
    gender = gender === "Male" ? 1 : 0
    country = pool.escape(country)
    let SUCCESSFULLY_UPDATED = true

    const sql = `UPDATE profile
                 SET FIRST_NAME = ${name},
                     GENDER     = ${gender},
                     COUNTRY    = ${country}
                 WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err) => {
        if (err) {
            SUCCESSFULLY_UPDATED = false
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        return callback(SUCCESSFULLY_UPDATED);
    });
}

function updateEmail(userID, email, callback) {
    email = pool.escape(email)

    let SUCCESSFULLY_UPDATED = true

    const sql = `UPDATE credentials
                 SET EMAIL = ${email}
                 WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err) => {
        if (err) {
            SUCCESSFULLY_UPDATED = false
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        return callback(SUCCESSFULLY_UPDATED);
    });
}

function loadClasses(callback) {
    const sql = `SELECT post_id,
                        topic,
                        teacher,
                        DATE_FORMAT(date, '%M %d, %Y') as date,
                        TIME_FORMAT(time, '%h:%i %p')  as time,
                        online,
                        address
                 FROM classes
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
    if (medium === "Online") medium = 1; else medium = 0;

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
function loadAllTasks(userID, callback){

    const sql = `SELECT TASK_ID, 
                TASK_NAME,
                DESCRIPTION,
                DATE_FORMAT(DATE, '%M %d, %Y') as DATE,
                TIME_FORMAT(TIME, '%h:%i %p')  as TIME
                FROM DAILY_PLANS WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err,results) => {
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
    updatePersonalInfo,
    updateEmail,
    loadAllTasks
}
