const express = require('express');
const database = require("../server/database");
const {Time} = require("../server/utility");
const httpMsg = require("http-msgs"); // Include Express.js
const router = express.Router(); // Create an Express.js app

router.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('dash');
    } else {
        res.redirect('/login');
    }
});

router.get('/classes', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    database.loadClasses((results) => {
        res.render('classes', {data: results});
    });
});

router.get('/prayer-times', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('PrayerTimes', {data: req.session.prayerTime});
});

function setPrayerTimeSession(req, res) {
    let isSuccess;
    req.session.prayerTime = req.body;

    let prayerTime = req.session.prayerTime;

    prayerTime.Fajr = Time.convertTo12(prayerTime.Fajr.slice(0, -6));
    prayerTime.Dhuhr = Time.convertTo12(prayerTime.Dhuhr.slice(0, -6));
    prayerTime.Asr = Time.convertTo12(prayerTime.Asr.slice(0, -6));
    prayerTime.Maghrib = Time.convertTo12(prayerTime.Maghrib.slice(0, -6));
    prayerTime.Isha = Time.convertTo12(prayerTime.Isha.slice(0, -6));

    if (req.session.prayerTime) {
        isSuccess = 1;
    } else isSuccess = 0;
    httpMsg.sendJSON(req, res, {
        success: isSuccess
    });
}

router.get('/logout', (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect('/login');
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

router.post('/setPrayerTimeSession', (req, res) => {
    setPrayerTimeSession(req, res);
});


//export the router.
//It will be used in 'app.js'
module.exports = router