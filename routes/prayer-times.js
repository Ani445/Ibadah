const express = require('express');
const router = express.Router(); // Create an Express.js app

const {Time} = require("../server/utility");
const httpMsg = require("http-msgs")
const axios = require("axios")
router.get('/prayer-times', async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        let year = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        let date = new Date().getDate()

        const response = (await axios.post('http://localhost:3000/get-prayer-times',
             {
                year,
                month,
                date,
                location: req.session.location
            }
        )).data
        // console.log(req.session.location)
        res.render('PrayerTimes', {data:response["data"], location: response.location})
        next();
    } catch (e) {
        console.error(e.error)
        next();
    }
});

router.post('/get-prayer-times', async (req, res) => {
    let {year, month, date} = req.body

    let location

    if (req.body.location) {
        location = req.body.location
    }
    else if (req.session.location) {
        location = req.session.location
    } else {
        location = {
            city: "Thakurgaon",
            country: "Bangladesh"
        }
    }

    try {
        const response = await axios.get(
            `http://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${location.city},${location.country}&method=2`);

        let timings = response.data.data[date - 1]["timings"];
        timings = Time.formatPrayerTimes(timings)
        // console.log(location);
        httpMsg.sendJSON(req, res, {
            data: timings,
            location: location
        })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'An error occurred while fetching data from the API'});
    }
});

module.exports = router;