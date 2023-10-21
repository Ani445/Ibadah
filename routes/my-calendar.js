const express = require('express');
const httpMsg = require("http-msgs");
// Include Express.js
const router = express.Router(); // Create an Express.js router 

router.get('/my-calendar',(req, res) => {
    res.render('my-calendar');
});

router.post('/calendar-events',(req, res) => {
    /*
    input: a date sent form the client
    output: the plans for that day
     */
});


//Export the router.
//It will be used in 'router.js'
module.exports = router
