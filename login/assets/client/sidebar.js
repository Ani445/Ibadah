$(document).ready(() => {
    if(window.location.pathname=='/home'){
        Dashboard = document.querySelector('.Dashboard');
        console.log("PAdu")
        Dashboard.classList.add('active');
    }
    else if(window.location.pathname=='/prayer-times'){
        PrayerTimes = document.querySelector('.PrayerTimes');
        PrayerTimes.classList.add('active');
    }
    else if(window.location.pathname=='/classes'){
        Events = document.querySelector('.Events');
        Events.classList.add('active');
    }
});