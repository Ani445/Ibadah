const express = require('express');
const database = require("../server/database");
const httpMsg = require("http-msgs"); // Include Express.js
const router = express.Router(); // Create an Express.js app

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    res.render('profile', {data: req.session.user})
});

router.post('/edit-name', (req, res) => {
    httpMsg.sendJSON(req, res, {
        success: 1
    });
});

router.post('/edit-email', (req, res) => {
    httpMsg.sendJSON(req, res, {
        success: 1
    });
});

router.post('/get-username', (req, res) => {
    let username;

    console.log(req.session)

    if (req.session.user.username) {
        username = req.session.user.username
    } else {
        username = 'User'
    }
    httpMsg.sendJSON(req, res, {
        username: username
    });
});

router.post('/change-email-otp', (req, res) => {

});

//export the router.
//It will be used in 'app.js'
module.exports = router