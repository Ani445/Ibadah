const express = require('express');
const httpMsg = require("http-msgs");
// Include Express.js
const router = express.Router(); // Create an Express.js router 

router.get('/calendar-events', (req, res) => {
    res.render('calendar-events');
});


//export the router.
//It will be used in 'router.js'
module.exports = router