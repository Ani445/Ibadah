const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const weekdays = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
}

const monthNameToNumber = {
    "Jan": 0,
    "Feb": 1,
    "Mar": 2,
    "Apr": 3,
    "May": 4,
    "Jun": 5,
    "Jul": 6,
    "Aug": 7,
    "Sep": 8,
    "Oct": 9,
    "Nov": 10,
    "Dec": 11,
    "January": 0,
    "February": 1,
    "March": 2,
    "April": 3,
    "June": 5,
    "July": 6,
    "August": 7,
    "September": 8,
    "October": 9,
    "November": 10,
    "December": 11
}

document.addEventListener('DOMContentLoaded', function () {
    let monthButton = document.querySelector("#month")
    let yearButton = document.querySelector("#year")
    let yearUpButton = document.querySelector("#year-up")
    let yearDownButton = document.querySelector("#year-down")

    let monthPickerContainer = document.querySelector("#month-picker-container")
    monthButton.value = months[new Date().getMonth()].substring(0, 3)
    yearButton.value = new Date().getFullYear()

    getDays(new Date().getMonth(), new Date().getFullYear());

    let monthValue = document.getElementsByClassName('month-name')

    yearUpButton.addEventListener('click', function () {
        yearButton.value++;
        getDays(monthNameToNumber[monthButton.value], yearButton.value.toString());
    })
    yearDownButton.addEventListener('click', function () {
        yearButton.value--;
        getDays(monthNameToNumber[monthButton.value], yearButton.value.toString());
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
                dates.GregorianDay = data["gregorian"]["day"];
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
            dateCells[i].addEventListener('click', function (event) {
                let cell = event.target
                if (cell['textContent']) {
                    console.log('lol')
                }
            })
        }

        let j = 0
        for (let i = start; j < dateArray.length && i < dateCells.length; i++) {
            dateCells[i].textContent = (j++ + 1).toString()
        }
    }

})
