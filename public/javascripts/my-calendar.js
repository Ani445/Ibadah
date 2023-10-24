
document.addEventListener('DOMContentLoaded', function () {

    /*for the task panel header*/
    let currentDate = document.querySelector('.Today');
    currentDate.innerHTML = "<span>"+new Date().getDate().toString()+" "+months[new Date().getMonth()].substring(0, 3) + " "+new Date().getFullYear().toString()+"</span>";
    /*for the task panel header*/

    let monthButton = document.querySelector("#month")
    let yearButton = document.querySelector("#year")
    let yearUpButton = document.querySelector("#year-up")
    let yearDownButton = document.querySelector("#year-down")

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
            getCalendarEvents(year, month, date)
            console.log({year, month, date})
            
            /*for the task panel header*/
            let currentDate = document.querySelector('.Today');
            currentDate.innerHTML = "<span>"+date+" "+months[month].substring(0, 3) + " "+year+"</span>";
            /*for the task panel header*/
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
     * @returns {{year, month, date}} An object containing the determined year, month, date
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
        return {year, month, date}
    }

    function getCalendarEvents(year, month, date) {
        $.ajax({
            url: '/calendar-events',
            method: 'POST',
            data: {
                year, month, date
            }
        })
            // .done(function (response) {
            //     showCalendarEvents()
            // })
    }

    // function showCalendarEvents() {

    // }
})
