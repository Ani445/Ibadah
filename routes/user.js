const express = require('express');
const http = require("http");
const router = express.Router(); // Create an Express.js app
const httpMsg = require('http-msgs')

router.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('dash');
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect('/login');
});

router.post('/set-user-location', (req, res) => {
    if (!req.session.location) {
        req.session.location = {
            city: req.body.city,
            country: req.body.country
        }
    }
    return httpMsg.sendJSON(req, res, {
        data: req.session.location
    })
});

//export the router.
//It will be used in 'app.js'
module.exports = router