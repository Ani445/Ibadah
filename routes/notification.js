const express = require('express');
const http = require("http");
const database = require("../server/database");
const router = express.Router(); // Create an Express.js app
const httpMsg = require('http-msgs')
const axios = require("axios");
const {verifyNotification} = require("../server/database");

async function checkPrayerTimes(req, res) {
    //Send a notification for prayer-time
    let prayerTimes;
    try {
        if (req.session.location) {
            let year = new Date().getFullYear()
            let month = new Date().getMonth() + 1
            let date = new Date().getDate()

            const response = (await axios.post('http://localhost:3000/get-prayer-times', {
                year, month, date, location: req.session.location
            })).data
            prayerTimes = [
                {waqt: "Fajr", time: response.data["Fajr"]},
                {waqt: "Dhuhr", time: response.data["Dhuhr"]},
                {waqt: "Asr", time: response.data["Asr"]},
                {waqt: "Maghrib", time: response.data["Maghrib"]},
                {waqt: "Isha", time: response.data["Isha"]}
            ];
        }
        let timeLeft = 0;
        let currentWaqt = -1;

        prayerTimes[4]["time"] = "08:11 PM";

        for (let i = 0; i < prayerTimes.length; i++) {
            timeLeft = compareTimes(prayerTimes[i]["time"]);
            if (timeLeft > 0) break;
            else currentWaqt = i;
        }
        if (currentWaqt == -1) currentWaqt = 4;


        database.verifyNotification(req.session.user.userID, new Date(),
            'prayer-isha-started', function (found) {
                if (!found) {
                    database.insertNewNotification(req.session.user.userID,
                        'prayer-isha-started', function () {

                        });
                }
            });

    } catch (e) {
        console.error(e.error)
    }
}

router.post('/check-for-notifications', async (req, res) => {
    try {
        if (!req.session.user) {
            return;
        }
        checkPrayerTimes(req, res);
        database.loadNotifications(req.session.user.userID, function (notifications) {
            // console.log(notifications);
            res.send({data: notifications});
        });

    } catch (e) {
        console.log(e);
    }
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