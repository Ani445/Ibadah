const express = require('express');
const http = require("http");
const router = express.Router(); // Create an Express.js app
const httpMsg = require('http-msgs')
const axios = require("axios");

const database = require("../server/database");

router.get('/home', (req, res) => {
    if (req.session.user) {
        database.loadDashClasses((results) => {
            res.render('dash', {data: results});
              });
    } else {
        res.redirect('/login');
    }
});


// router.get('/home', (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login');
//     }
//     database.loadDashClasses((results) => {
//         res.render('dash', {data: results});
//     });
// });


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