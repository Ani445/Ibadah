const express = require('express');
const router = express.Router(); // Create an Express.js app

const database = require("../server/database");
const httpMsg = require("http-msgs"); // Include Express.js

router.get('/classes', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    database.loadClasses((results) => {
        console.log(results)
        res.render('classes', {data: results});
    });
});

router.post('/new-class', (req, res) => {
    let addressOrLink;
    if (req.body.medium === "Online") {
        addressOrLink = req.body.link;
    } else {
        addressOrLink = req.body.address;
    }

    database.insertNewClasses(req.body.topic, req.body.teacher, req.body.medium,
        addressOrLink, req.body.classDate, req.body.classTime, (isSuccess) => {
            httpMsg.sendJSON(req, res, {
                success: isSuccess,
            });
        });
});

//export the router.
//It will be used in 'app.js'
module.exports = router