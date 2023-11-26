const express = require('express');
const http = require("http");
const router = express.Router(); // Create an Express.js app
const httpMsg = require('http-msgs')
const axios = require("axios");

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

router.post('/set-user-location', (req, res, next) => {
    req.session.location = {
        city: req.body.city, country: req.body.country
    }
    httpMsg.sendJSON(req, res, {
        data: req.session.location
    })
});

//Export the router.
//It will be used in 'app.js'
module.exports = router