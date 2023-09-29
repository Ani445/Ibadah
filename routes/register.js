const express = require('express');
const database = require("../server/database");
const httpMsg = require("http-msgs");
const emailSender = require("../server/email");
const httpMsgs = require("http-msgs"); // Include Express.js
const router = express.Router(); // Create an Express.js app

router.get('/signup', (req, res) => {
    res.redirect('/login');
});

router.get('/otp', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else if (req.session.redirected) {
        res.render('otp');
        delete req.session.redirected;
    } else {
        res.redirect('/login');
    }
});

router.get('/mailverify', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('mailverify');
    }
});

router.post('/otp', (req, res) => {
    let isSuccess;
    let otp = req.body.otp;
    if (otp === sentOTP) {
        isSuccess = 1;
        database.insertUser(_username, _password, _email, (err) => {
            if (err) {
                isSuccess = 0
            }
        });
    } else {
        isSuccess = 0;
    }
    httpMsg.sendJSON(req, res, {
        success: isSuccess,
    });
});

router.post('/mailverify', (req, res) => {
    let email = req.body.email;

    database.verifyMail(email, (found) => {
        //console.log(callback);
        // console.log(found);
        if (!found) {
            //From here, the user will be redirected to '/forgotpassotp' route
            req.session.redirected = true;

            emailSender.sendMailTo(email, generatedOTP => {
                sentOTP = generatedOTP;
            });
        }
        httpMsgs.sendJSON(req, res, {
            success: !found,
        });
    });
});

router.post('/signup', (req, res) => {
    let email = req.body.email;

    database.verifyMail(email, (isSuccess) => {
        //console.log(callback);
        // console.log("trying to signup");
        if (isSuccess) {
            //From here, the user will be redirected to '/otp' route
            req.session.redirected = true;
            emailSender.sendMailTo(email, generatedOTP => {
                sentOTP = generatedOTP;
            });
        }
        httpMsgs.sendJSON(req, res, {
            success: isSuccess,
        });
    });
});

module.exports = router