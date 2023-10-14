const express = require('express');
const httpMsg = require("http-msgs");
// Include Express.js
const router = express.Router(); // Create an Express.js router 

router.post('/setSidebarState', (req, res) => {
    req.session.sidebarState = req.body.state;
    httpMsg.sendJSON(req, res, {
       state: req.session.sidebarState
    });
});

router.get('/getSidebarState', (req, res) => {
    httpMsg.sendJSON(req, res, {
        state: req.session.sidebarState
    });
});



//export the router.
//It will be used in 'router.js'
module.exports = router