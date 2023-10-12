$((city)=>{
    console.log(city);

    const settings = {
        async: true,
        crossDomain: true,
        url: `http://api.aladhan.com/v1/calendarByAddress/2023/9?address=${city}&method=2`,
        method: 'GET'
    }

    $.ajax(settings).done(function (response) {
        //  console.log(response.data[0].timings.Fajr);
        const prayerTime =
            {
                location: city,
                Fajr: response.data[0].timings.Fajr,
                Dhuhr: response.data[0].timings.Dhuhr,
                Asr: response.data[0].timings.Asr,
                Maghrib: response.data[0].timings.Maghrib,
                Isha: response.data[0].timings.Isha
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
});


