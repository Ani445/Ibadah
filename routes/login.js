const express = require('express');
const httpMsgs = require("http-msgs");
const database = require("../server/database"); // Include Express.js
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

    database.checkCredentials(email, password, (results) => {
        let isSuccess;

        if (!results.length) {
            isSuccess = 0;
        } else {
            isSuccess = 1;
            req.session.user = {
                email: results[0].EMAIL,
                username: results[0].USER_NAME
            }
        }
        httpMsgs.sendJSON(req, res, {
            success: isSuccess,
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
    if (otp === sentOTP) {
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
    let new_password = req.body.new_password;

    database.updatePassword(_email, new_password, (isSuccess) => {
        httpMsgs.sendJSON(req, res, {
            success: isSuccess,
        });
    });
});

module.exports = router