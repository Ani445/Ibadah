const express = require('express');
const router = express.Router(); // Create an Express.js app

const {Time} = require("../server/utility");
const httpMsg = require("http-msgs")
const axios = require("axios")
const http = require("http");
router.get('/prayer-times', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.location) {
        res.render('PrayerTimes', {data: req.session.prayerTime, location: req.session.location});
    }
});

router.post('/get-prayer-times', async (req, res) => {
    let {year, month, date} = req.body

    let location

    if(req.body.location) {
        location = req.body.location
    }
    else if(req.session.location) {
        location = req.session.location
    }
    else {
        location = {
            city: "Dhaka",
            country: "Bangladesh"
        }
    }

    try {
        // Replace 'https://api.example.com/data' with the actual API endpoint URL
        const response = await axios.get(
            `http://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${location.city},${location.country}&method=2`);

        // Assuming the API returns JSON data
        let timings = response.data.data[date - 1]["timings"];
        timings = Time.formatPrayerTimes(timings)

        // console.log(timings)

        httpMsg.sendJSON(req, res, {
            data: timings
        })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while fetching data from the API'});
    }
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