const express = require('express');
const httpMsgs = require("http-msgs");
const database = require("../server/database");
const emailSender = require("../server/email");
const httpMsg = require("http-msgs");
const {user} = require('../server/database-objects')
const {createOTP} = require("../server/email"); // Include Express.js
const router = express.Router(); // Create an Express.js app

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('login', {data: req.session.prayerTime});
    }
});


router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    database.checkCredentials(email, password, (isSuccess) => {
        if (isSuccess) {
            const { userID, userName, email, gender, country, phone } = user;
            req.session.user = { userID, username: userName, email, gender, country, phone };

            delete req.session.temp;

            req.session.user.allTasks = {}
            database.loadAllTasks(userID, (results)=>{

                
                for(let i=0;i<results.length;i++){
                    date = new Date(results[i].DATE);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('en-US', options);

                    if(!req.session.user.allTasks[formattedDate])
                        req.session.user.allTasks[formattedDate] = []
                    req.session.user.allTasks[formattedDate].push({...results[i]});
                }
                //console.log(req.session.user.allTasks);
                httpMsgs.sendJSON(req, res, {
                    success: isSuccess,
                });
            })
        }
    });
});

router.get('/mailverify', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('mailverify');
    }
});

router.post('/mailverify', (req, res) => {
    let email = req.body.email;

    database.verifyMail(email, (found) => {
        if (found) {

            let generatedOTP = createOTP()
            req.session.temp = {
                email: email,
                sentOTP: generatedOTP
            }

            //From here, the user will be redirected to '/forgotpassotp' route
            req.session.redirected = true;

            emailSender.sendMailTo(email, generatedOTP, generatedOTP => {
            });
        }
        httpMsg.sendJSON(req, res, {
            success: found,
        });
    });
});

router.get('/forgotpassotp', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else if (req.session.redirected) {
        res.render('forgotpassotp');
        delete req.session.redirected;
    } else {
        res.redirect('/login');
    }
});

router.post('/forgotpassotp', (req, res) => {
    let otp = req.body.otp;

    let isSuccess;
    if (otp === req.session.temp.sentOTP) {
        //From here, the user will be redirected to '/changepass' route
        req.session.redirected = true;
        isSuccess = 1;
    } else {
        isSuccess = 0;
    }
    httpMsgs.sendJSON(req, res, {
        success: isSuccess,
    });
});

router.get('/changepass', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else if (req.session.redirected) {
        res.render('changepass');
    } else {
        res.redirect('/login');
    }
});

router.post('/changepass', (req, res) => {
    database.updatePassword(req.session.temp.email, req.body.new_password, (isSuccess) => {
        httpMsgs.sendJSON(req, res, {
            success: isSuccess,
        });
    });
});

module.exports = router