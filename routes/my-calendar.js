const express = require('express');
const httpMsgs = require("http-msgs");
// Include Express.js
const router = express.Router(); // Create an Express.js router 

router.get('/my-calendar',(req, res) => {
    res.render('my-calendar');
});


router.post('/calendar-events',(req, res) => {
    console.log(req.session.user.allTasks);
    httpMsgs.sendJSON(req, res, {
        tasks: req.session.user.allTasks[req.body.date]
    });    
});


//Export the router.
//It will be used in 'router.js'
module.exports = router
