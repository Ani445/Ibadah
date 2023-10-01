
// Create an Express.js Router
const router = require('express').Router();

const database = require("../server/database");
const emailSender = require("../server/email");

//To send response to the client for get or post requests
const httpMsg = require("http-msgs");

const {createOTP} = require("../server/email");

router.get('/register', (req, res) => {
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

router.post('/otp', (req, res) => {
    let isSuccess;
    let otp = req.body.otp;
    if (otp === req.session.temp.sentOTP) {
        isSuccess = 1;
        database.insertUser(req.session.temp.username, req.session.temp.password, req.session.temp.email, (err) => {
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

router.post('/register', (req, res) => {
    let email = req.body.email;

    database.verifyMail(email, (found) => {
        let generatedOTP = createOTP();

        req.session.temp = {
            email: email, username: req.body.username, password: req.body.password, sentOTP: generatedOTP
        }

        if (!found) { //If not found, then the user can be registered
            req.session.redirected = true;
            emailSender.sendMailTo(email, generatedOTP)
        }
        httpMsg.sendJSON(req, res, {
            success: !found,
        });
    });
});

module.exports = router