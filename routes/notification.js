const express = require('express');
const http = require("http");
const database = require("../server/database");
const router = express.Router(); // Create an Express.js app
const httpMsg = require('http-msgs')
const axios = require("axios");

async function checkPrayerTimes(req) {
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
        let notificationType;
        let newNotificationCame = false;

        prayerTimes[0]["time"] = "12:59 AM";

        for (let i = 0; i < prayerTimes.length; i++) {
            timeLeft = compareTimes(prayerTimes[i]["time"]);
            // console.log(timeLeft)
            if (-2 <= timeLeft && timeLeft <= 0) {
                notificationType = `prayer-${prayerTimes[i]["waqt"]}-started`;
                newNotificationCame = true;
                break;
            } else if (timeLeft === 30) {
                notificationType = `prayer-${prayerTimes[i]["waqt"]}-30`;
                newNotificationCame = true;
                break;
            } else if (15 === timeLeft) {
                notificationType = `prayer-${prayerTimes[i]["waqt"]}-15`;
                newNotificationCame = true;
                break;
            }
        }

        if(!newNotificationCame) return;

        database.verifyNotification(new Date(),
            notificationType, function (found) {
                if (!found) {
                    database.insertNewNotification(notificationType, function () {

                        });
                }
            });

    } catch (e) {
        console.error(e.error)
    }
}

async function checkPlans(){
    let newNotificationCame = false;
    let notificationType;

    

    if(!newNotificationCame) return;

    database.verifyNotification(new Date(),
        notificationType, function (found) {
            if (!found) {
                database.insertNewNotification(notificationType, function () {

                });
            }
        });
}

router.post('/check-for-notifications', async (req, res) => {
    try {
        if (!req.session.user) {
            return;
        }
        checkPrayerTimes(req);
        database.loadNotifications(req.session.user.userID, function (notifications) {
            // console.log(notifications);
            res.send({data: notifications});
        });

    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

function compareTimes(timeStr) {
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();
    let currentTime = currentHour * 60 + currentMinute;

    let amPM = timeStr.toString().substring(6, 8);

    let givenHour = parseInt(timeStr.toString().substring(0, 2));
    if(givenHour === 12 && amPM === "AM") givenHour = 0;
    let givenMinute = parseInt(timeStr.toString().substring(3, 5));
    let add12h = (amPM === 'AM') ? 0 : 12;
    let givenTime = (givenHour + add12h) * 60 + givenMinute;

    return (givenTime - currentTime);
}

module.exports = router