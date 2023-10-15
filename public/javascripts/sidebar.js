var state = 0;
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
    getStateFromServer();
    InitClientState();
    setServerState();
});

hamburger = document.querySelector('.hamburger');
sidebar = document.querySelector('.sidebar');
hamburger.addEventListener('click', () => {
    // sidebar.classList.add('state');
    ChangeClientState();
    setServerState();
});

function setServerState()
{
    const obj={
        state: state
    }
    $.ajax({
        type: 'post',
        async: false,
        url: '/setSidebarState',
        data: obj,
        // contentType: "application/json; charset=utf-8",
        dataType:'json'
    })
    .done(function (response){
        // console.log(response.state);
    });
}

function ChangeClientState(){
    if(state==0){
        sidebar.style.width= "240px";
        sidebar.style.transition = "0.5s";
        state=1;
    }
    else if(state==1){
        sidebar.style.width= "108px";
        sidebar.style.transition = "0.5s";
        state=0;
    }
}

function InitClientState()
{
    if(state==1){
        sidebar.style.transition = "none";
        sidebar.style.width= "240px";
    }
    else if(state==0){
        sidebar.style.transition = "none";
        sidebar.style.width= "108px";
    }
}

function getStateFromServer(){
    $.ajax({
        type: 'get',
        async: false,
        url: '/getSidebarState',
        dataType: 'json'
    })
    .done(function (response) {
        if(response.state==1){
            state = 1;
        }
        else if(response.state==0 || response.state == null){
            state = 0;
        }
    });
}