const express = require('express');
const router = express.Router(); // Create an Express.js app

const {Time} = require("../server/utility");
const httpMsg = require("http-msgs")
router.get('/prayer-times', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('PrayerTimes', {data: req.session.prayerTime, location: req.session.location});
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


router.post('/setPrayerTimeSession', (req, res) => {
    setPrayerTimeSession(req, res);
});

module.exports = router;