$(document).ready(() => {
    if(window.location.pathname=='/home'){
        Dashboard = document.querySelector('.Dashboard');
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
    // $.ajax({
    //     type: 'get',
    //     url: $(form).attr('action'),
    //     data: $(form).serialize(),
    //     dataType: 'json'
    // })
    // .done(function (response) {
        
    // });
    open =0;
});

hamburger = document.querySelector('.hamburger');
sidebar = document.querySelector('.sidebar');
hamburger.addEventListener('click', () => {
    // sidebar.classList.add('open');
    if(open==0){
        sidebar.style.width= "240px";
        sidebar.style.transition = "0.5s";
        open=1;
    }
    else if(open==1){
        sidebar.style.width= "108px";
        sidebar.style.transition = "0.5s";
        open=0;
    }
});