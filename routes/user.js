const express = require('express');
const router = express.Router(); // Create an Express.js app

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

//export the router.
//It will be used in 'app.js'
module.exports = router