document.addEventListener('DOMContentLoaded', function () {
    let monthButton = document.querySelector("#month")
    let yearButton = document.querySelector("#year")
    let yearUpButton = document.querySelector("#year-up")
    let yearDownButton = document.querySelector("#year-down")

    let gYear = new Date().getFullYear()
    let gMonth = new Date().getMonth() + 1
    let gDate = new Date().getDate()
    let gLocation = null

    let monthPickerContainer = document.querySelector("#month-picker-container")
    monthButton.value = months[new Date().getMonth()].substring(0, 3)
    yearButton.value = new Date().getFullYear()

    getDays(new Date().getMonth(), new Date().getFullYear());

    let monthValue = document.getElementsByClassName('month-name')

    let dateCells = document.getElementsByClassName('date-cell')

    for (let i = 0; i < dateCells.length; i++) {
        dateCells[i].textContent = ""
        dateCells[i].addEventListener('click', function (event) {
            let {year, month, date} = determineDateFromCalendar(event)
            getPrayerTimes(year, month, date, gLocation)
        })
    }

    yearUpButton.addEventListener('click', function () {
        yearButton.value++;
        getDays(monthNameToNumber[monthButton.value], yearButton.value);
    })
    yearDownButton.addEventListener('click', function () {
        yearButton.value--;
        getDays(monthNameToNumber[monthButton.value], yearButton.value);
    })

    for (let i = 0; i < monthValue.length; i++) {
        monthValue[i].addEventListener('click', function () {
            monthButton.value = monthValue[i].textContent;
            let monthNumber = monthNameToNumber[monthButton.value]

            getDays(monthNumber, yearButton.value); // setting month number for api req
        });
    }

    document.addEventListener('click', function (event) {
        if (event.target.id !== monthButton.id) {
            closeMonthPicker()
        } else if (monthPickerContainer.style.display === 'none') {
            openMonthPicker()
        } else {
            closeMonthPicker()
        }
    })

    function openMonthPicker() {
        monthPickerContainer.style.display = 'block'
    }

    function closeMonthPicker() {
        monthPickerContainer.style.display = 'none'
    }

    function getDays(month, year) {
        const settings = {
            async: true,
            crossDomain: true,
            url: `http://api.aladhan.com/v1/gToHCalendar/${month + 1}/${year}`,
            method: 'GET'
        }

        $.ajax(settings).done(function (response) {
            let dates =
                {
                    GregorianDay: null,
                    GregorianWeekday: null,
                    GregorianMonth: null,
                    HijriDay: null,
                    HijriEnglishWeekday: null,
                    HijriArabicWeekday: null
                };
            let dateArr = [];

            for (let i = 0; response.data[i] != null; i++) {
                data = response.data[i];
                // console.log(response.data)

                dates.GregorianDay = data["gregorian"]["day"];
                dates.GregorianMonth = data["gregorian"]["month"]["number"];
                dates.GregorianMonthName = data["gregorian"]["day"]["en"];
                dates.GregorianYear = data["gregorian"]["year"];
                dates.GregorianWeekday = data["gregorian"]["weekday"]["en"];
                dates.HijriDay = data["hijri"]["day"];
                dates.HijriEnglishWeekday = data["hijri"]["weekday"]["en"];
                dates.HijriArabicWeekday = data["hijri"]["weekday"]["ar"];

                dateArr.push({...dates});
            }
            populateCalendar(dateArr)
        });
    }

    function populateCalendar(dateArray) {
        let start = weekdays[dateArray[0].GregorianWeekday]

        let dateCells = document.getElementsByClassName('date-cell')

        for (let i = 0; i < dateCells.length; i++) {
            dateCells[i].textContent = ""
            dateCells[i].classList.remove('previous-month')
            dateCells[i].classList.remove('next-month')
            dateCells[i].classList.remove('current-month')
        }

        let j = new Date(dateArray[0].GregorianYear, dateArray[0].GregorianMonth - 1, 0).getDate()
        let i

        for (i = start - 1; i >= 0; i--) {
            dateCells[i].textContent = (j--).toString()
            dateCells[i].classList.add('previous-month')
        }

        i = start
        j = 0
        for (; j < dateArray.length && i < dateCells.length; i++) {
            dateCells[i].textContent = (++j).toString()
            dateCells[i].classList.add('current-month')
        }

        j = 0
        for (; i < dateCells.length; i++) {
            dateCells[i].textContent = (++j).toString()
            dateCells[i].classList.add('next-month')
        }
    }

    /**
     *
     * @param event The event generated by a mouse-click on a cell of the calendar
     * @returns {{year, month, date}} An object containing the determine year, month, date
     */

    function determineDateFromCalendar(event) {
        let cell = event.target

        let year = yearButton.value
        let month = monthNameToNumber[monthButton.value]
        let date = cell.textContent

        if (cell.classList.contains('previous-month')) {
            month--
            if (month < 0) {
                month = 11
                year--
            }
        } else if (cell.classList.contains('next-month')) {
            month++
            if (month > 11) {
                month = 0
                year++
            }
        }
        month++ // to make the year 1 index, to use in the API

        gYear = year
        gMonth = month
        gDate = date

        return {year, month, date}
    }

    function getPrayerTimes(year, month, date, location) {
        $.ajax({
            url: '/get-prayer-times',
            method: 'POST',
            data: JSON.stringify({
                year,
                month,
                date,
                location
            }),
            contentType: "application/json",
            dataType: "JSON"
        })
            .done(function (response) {
                console.log(response.data)
                updatePrayerTimes(response.data)
            })
    }

    addAllCities()

    function updatePrayerTimes(data) {
        document.querySelector("#fajr-time").textContent = data['Fajr']
        document.querySelector("#dhuhr-time").textContent = data['Dhuhr']
        document.querySelector("#asr-time").textContent = data['Asr']
        document.querySelector("#maghrib-time").textContent = data['Maghrib']
        document.querySelector("#isha-time").textContent = data['Isha']

        // console.log(data)
    }

    function fetchAllCountryNames() {
        const username = 'abeshahsan';
        const countryName = 'United States'; // Replace with the desired country name

        $.ajax({
            async: true,
            crossDomain: true,
            // url: `https://restcountries.com/v3.1/all`,
            url: `http://api.geonames.org/countryInfoJSON?username=${username}`,
            method: 'GET'
        })
            .done(function (response) {
                const countryNames = response["geonames"].map(country => country["countryName"]);
                console.log(countryNames)
            })
    }

    function fetchAllCityNames(country) {
        const username = 'abeshahsan';
        const countryName = 'BD'; // Replace with the desired country name

        $.ajax({
            async: true,
            crossDomain: true,
            // url: `https://restcountries.com/v3.1/all`,
            url: `http://api.geonames.org/searchJSON?country=${countryName}&maxRows=500&style=FULL&&featureClass=P&username=${username}`,
            method: 'GET',
            dataType: 'JSON'
        })
            .done(function (response) {
                const cityNames = response["geonames"].map(city => city["toponymName"]);
                cityNames.sort()
                // const cityNames = response;
                console.log(cityNames)
            })
    }

    // fetchAllCountryNames()
    // fetchAllCityNames()

    function addAllCities() {
        let select = document.querySelector(".city-list");

        for (let x in districtNames) {
            if (select[0].value != districtNames[x]) {
                let option = document.createElement("option");
                option.textContent = districtNames[x];
                select.appendChild(option);
            }
        }

        select.addEventListener("change", function (event) {
            // Code to handle the change event goes here
            // console.log("Selected value: " + select.value);
            gLocation = {
                city: select.value.toString(),
                country: "Bangladesh"
            }
            // console.log(location)
            getPrayerTimes(gYear, gMonth, gDate, gLocation)
        });
    }

    updateRowColor();
    updateCurrentWaqt();
})

function updateCurrentWaqt() {

    var ONE_MINUTE = 60 * 1000;
    setInterval(updateRowColor, ONE_MINUTE - 2000);//milliseconds
}

function updateRowColor() {
    let waqtArr = [];
    waqtArr.push(document.getElementById('fajr-time'));
    waqtArr.push(document.getElementById('dhuhr-time'));
    waqtArr.push(document.getElementById('asr-time'));
    waqtArr.push(document.getElementById('maghrib-time'));
    waqtArr.push(document.getElementById('isha-time'));
    let currentWaqt = -1;
    for (let i = 0; i < 5; i++) {
        waqtArr[i].parentNode.classList.remove('is-selected');
        if (compareTimes(waqtArr[i].textContent) > 0) break;
        else if (compareTimes(waqtArr[i].textContent >= 0)) currentWaqt = i;
    }
    if (currentWaqt == -1) currentWaqt = 4;

    let parentRow = waqtArr[currentWaqt].parentNode;
    parentRow.classList.add('is-selected');
}

function compareTimes(timeStr) {
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();
    let currentTime = currentHour * 60 + currentMinute;

    let givenHour = parseInt(timeStr.toString().substring(0, 2));
    let givenMinute = parseInt(timeStr.toString().substring(3, 5));
    let add12h = (timeStr.toString().substring(6, 8) == 'AM') ? 0 : 12;
    let givenTime = (givenHour + add12h) * 60 + givenMinute;

    if (givenTime == currentTime) {
        return 0;
    } else if (givenTime < currentTime) {
        return -1;
    } else return 1;
}

let districtNames =
    [
        "Dhaka",
        "Faridpur",
        "Gazipur",
        "Gopalganj",
        "Jamalpur",
        "Kishoreganj",
        "Madaripur",
        "Manikganj",
        "Munshiganj",
        "Mymensingh",
        "Narayanganj",
        "Narsingdi",
        "Netrokona",
        "Rajbari",
        "Shariatpur",
        "Sherpur",
        "Tangail",
        "Bogra",
        "Joypurhat",
        "Naogaon",
        "Natore",
        "Nawabganj",
        "Pabna",
        "Rajshahi",
        "Sirajgonj",
        "Dinajpur",
        "Gaibandha",
        "Kurigram",
        "Lalmonirhat",
        "Nilphamari",
        "Panchagarh",
        "Rangpur",
        "Thakurgaon",
        "Barguna",
        "Barisal",
        "Bhola",
        "Jhalokati",
        "Patuakhali",
        "Pirojpur",
        "Bandarban",
        "Brahmanbaria",
        "Chandpur",
        "Chittagong",
        "Comilla",
        "Cox's Bazar",
        "Feni",
        "Khagrachari",
        "Lakshmipur",
        "Noakhali",
        "Rangamati",
        "Habiganj",
        "Maulvibazar",
        "Sunamganj",
        "Sylhet",
        "Bagerhat",
        "Chuadanga",
        "Jessore",
        "Jhenaidah",
        "Khulna",
        "Kushtia",
        "Magura",
        "Meherpur",
        "Narail",
        "Satkhira"
    ]
