

getCoordinates(function (location) {
    sendLocationToServer(location)
    getPrayerTimes(location, new Date().getFullYear(), new Date().getMonth());
});

function sendLocationToServer(location) {
    $.ajax({
        type: 'post',
        url: '/set-user-location',
        data: location,
        dataType: 'json'
    })
}

function getPrayerTimes(location, year, month) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `http://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${location.city},${location.country}&method=2`,
        method: 'GET'
    }

    $.ajax(settings).done(function (response) {
        let timings = response.data[0]["timings"]
        const prayerTime =
            {
                Fajr: timings["Fajr"],
                Dhuhr: timings["Dhuhr"],
                Asr: timings["Asr"],
                Maghrib: timings["Maghrib"],
                Isha: timings["Isha"]
            };
        $.ajax({
            type: 'POST',
            url: '/setPrayerTimeSession',
            data: prayerTime,
            dataType: 'json'
        })
            // console.log(prayerTime);
            .done(function (response) {
                console.log('Done');
            });
    });
}

function getCoordinates(callback) {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        let crd = pos.coords;
        let lat = crd.latitude.toString();
        let lng = crd.longitude.toString();
        let coordinates = [lat, lng];
        // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates, function (location) {
            if (!getCoordinates.called) {
                getCoordinates.called = true;
                callback(location)
            }
        });
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates, callback) {
    let xhr = new XMLHttpRequest();
    let lat = coordinates[0];
    let lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.0482b87343c943c6aac1063bf8692d40&lat=" +
        lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        let location = {
            city: "Dhaka",
            country: "Bangladesh"
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            location = {
                city: response.address.city,
                country: response.address.country
            }
            callback(location);
        }
    }
}