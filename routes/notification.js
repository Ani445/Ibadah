const express = require('express');
const http = require("http");
const database = require("../server/database");
const router = express.Router(); // Create an Express.js app
const httpMsg = require('http-msgs')
const axios = require("axios");

router.post('/checkk-for-notifications', async (req, res) => {
    //Send a notification for prayer-time
    try {
        if (!req.session.prayerTimes && req.session.location) {
            let year = new Date().getFullYear()
            let month = new Date().getMonth() + 1
            let date = new Date().getDate()

            const response = (await axios.post('http://localhost:3000/get-prayer-times', {
                year, month, date, location: req.session.location
            })).data
            req.session.prayerTimes = [
                {waqt: "Fajr", time: response.data["Fajr"], notified: false},
                {waqt: "Dhuhr", time: response.data["Dhuhr"], notified: false},
                {waqt: "Asr", time: response.data["Asr"], notified: false},
                {waqt: "Maghrib", time: response.data["Maghrib"], notified: false},
                {waqt: "Isha", time: response.data["Isha"], notified: false}
            ];
        }
        let timeLeft = 0;
        let currentWaqt = -1;

        req.session.prayerTimes[4]["time"] = "08:11 PM";

        for (let i = 0; i < req.session.prayerTimes.length; i++) {
            timeLeft = compareTimes(req.session.prayerTimes[i]["time"]);
            if (timeLeft > 0) break;
            else currentWaqt = i;
        }
        if (currentWaqt == -1) currentWaqt = 4;
        let notification = null;
        if (!req.session.prayerTimes[currentWaqt].notified) {
            if (-2 <= timeLeft && timeLeft <= 0) {
                notification = {
                    type: "prayer-time",
                    status: "time-left",
                    timeLeft: timeLeft
                }
                req.session.prayerTimes[currentWaqt].notified = true;
            }
        }
        res.send({data: notification});
    } catch (e) {
        console.error(e.error)
        res.send({data: null});
    }
});

router.post('/check-for-notifications', async (req, res) => {
    if (!req.session.user) {
        return;
    }
    database.loadNotifications(req.session.user.userID, function (notifications) {
        // console.log(notifications);
        res.send({data: notifications});
    });
});

function compareTimes(timeStr) {
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();
    let currentTime = currentHour * 60 + currentMinute;

    let givenHour = parseInt(timeStr.toString().substring(0, 2));
    let givenMinute = parseInt(timeStr.toString().substring(3, 5));
    let add12h = (timeStr.toString().substring(6, 8) == 'AM') ? 0 : 12;
    let givenTime = (givenHour + add12h) * 60 + givenMinute;

    return (givenTime - currentTime);
}

module.exports = router