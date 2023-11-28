const express = require('express');
const router = express.Router(); // Create an Express.js app

const database = require("../server/database");
const httpMsg = require("http-msgs"); // Include Express.js

router.get('/classes', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    database.loadClasses((results) => {
        res.render('classes', {data: results, currentUserID: req.session.user.userID});
        // console.log(req.session.user.userID)
    });
});

router.get('/class-list', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    database.loadClasses((results) => {
        httpMsg.sendJSON(req, res, {
            data: results,
        });
    });
});

router.post('/new-class', (req, res) => {
    if(!req.session.user) return;

    let addressOrLink;
    if (req.body["medium"] === "Online") {
        addressOrLink = req.body.link;
    } else {
        addressOrLink = req.body.address;
    }

    database.insertNewClasses(req.session.user.userID, req.body["topic"], req.body["teacher"], req.body["medium"],
        addressOrLink, req.body["classDate"], req.body["classTime"], (isSuccess) => {
            httpMsg.sendJSON(req, res, {
                success: isSuccess,
            });
        });
});

router.post('/delete-class/:id', (req, res) => {
    if(!req.session.user) return;

    database.deleteCLass(req.params.id, (isSuccess) => {
            httpMsg.sendJSON(req, res, {
                success: isSuccess,
            });
        });
});

//Export the router.
//It will be used in 'app.js'
module.exports = router