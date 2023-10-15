const express = require('express');
const router = express.Router(); // Create an Express.js app

const {Time} = require("../server/utility");
const httpMsg = require("http-msgs")
const axios = require("axios")
const http = require("http");
router.get('/prayer-times', async (req, res) => {
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
        return res.render('PrayerTimes', {data:response["data"], location: response.location})
    } catch (e) {
        console.error(e.error)
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
        // Replace 'https://api.example.com/data' with the actual API endpoint URL
        const response = await axios.get(
            `http://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${location.city},${location.country}&method=2`);

        // Assuming the API returns JSON data
        let timings = response.data.data[date - 1]["timings"];
        timings = Time.formatPrayerTimes(timings)

        // console.log(timings)

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