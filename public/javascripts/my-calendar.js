var selectedElement;
document.addEventListener('DOMContentLoaded', function () {

    currentDate = document.querySelector('.Today >.en');
    let todayDate = new Date().getDate();
    let todayMonth = new Date().getMonth();
    let todayYear = new Date().getFullYear();

    currentDate.innerHTML = "<span>" + todayDate + " " + months[todayMonth].substring(0, 3) + " " + todayYear + "</span>";
    currentArabicDate = document.querySelector('.Today > .ar');
    currentArabicDate.innerHTML = "<span>" + new HijrahDate(new Date()).format('longDate', 'en') + "</span>";

    let monthButton = document.querySelector("#month")
    let yearButton = document.querySelector("#year")
    let yearUpButton = document.querySelector("#year-up")
    let yearDownButton = document.querySelector("#year-down")

    let monthPickerContainer = document.querySelector("#month-picker-container")
    monthButton.value = months[todayMonth].substring(0, 3);
    yearButton.value = todayYear;

    getDays(todayMonth, todayYear);

    let monthValue = document.getElementsByClassName('month-name')

    let dateCells = document.getElementsByClassName('date-cell')

    for (let i = 0; i < dateCells.length; i++) {
        dateCells[i].addEventListener('click', function (event) {

            let {year, month, date} = determineDateFromCalendar(event)
            getCalendarEvents(year, month, date);

            currentDate.innerHTML = "<span>" + date + " " + months[month].substring(0, 3) + " " + year + "</span>";

            currentArabicDate.innerHTML = "<span>" + new HijrahDate(new Date(year, month, date)).format('longDate', 'en') + "</span>"

            if (selectedElement == dateCells[i]) return;
            if (selectedElement != null) setDefault(selectedElement);
            if (dateCells[i].classList.contains('current-date') == false) {
                dateCells[i].style.backgroundColor = "#e2e1f1df";
                selectedElement = dateCells[i];
            }

        })

        dateCells[i].addEventListener('dblclick', function (event) {
            let {year, month, date} = determineDateFromCalendar(event);
            openModal(year, month, date);
        })
    }

    getCalendarEvents(todayYear, todayMonth, todayDate);

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
            getDays(monthNumber, yearButton.value);
        });
    }

    document.addEventListener('click', function (event) {
        if (event.target.id !== monthButton.id) {
            closeMonthPicker()
        } else if (monthPickerContainer.classList.contains('hidden')) {
            openMonthPicker()
        } else {
            closeMonthPicker()
        }
    })

    function openMonthPicker() {
        monthPickerContainer.classList.remove('hidden')
    }

    function closeMonthPicker() {
        monthPickerContainer.classList.add('hidden')
    }

    function getDays(month, year) {
        let date = new Date(year, month, 1);
        let dateObj = {
            GregorianDay: date.getDate(),
            GregorianWeekday: date.getDay(),
            GregorianMonth: month,
            GregorianYear: year
        }
        let dateArray = [];
        while (date.getMonth() === month) {
            dateArray.push({...dateObj});
            date.setDate(date.getDate() + 1);
            dateObj.GregorianDay = date.getDate();
            dateObj.GregorianWeekday = date.getDay();
            dateObj.GregorianMonth = month;
            dateObj.GregorianYear = year;
        }
        populateCalendar(dateArray);
    }

    function populateCalendar(dateArray) {
        let start = dateArray[0].GregorianWeekday;

        let dateCells = document.getElementsByClassName('date-cell')

        for (let i = 0; i < dateCells.length; i++) {
            dateCells[i].innerHTML = "";
            dateCells[i].classList.remove('previous-month')
            dateCells[i].classList.remove('next-month')
            dateCells[i].classList.remove('current-month')
            dateCells[i].classList.remove('current-date')
        }

        let j = new Date(dateArray[0].GregorianYear, dateArray[0].GregorianMonth, 0).getDate()
        let i

        for (i = start - 1; i >= 0; i--) {
            dateCells[i].innerHTML = dateCellContent(monthNameToNumber[monthButton.value] - 1, j);
            j--;
            dateCells[i].classList.add('previous-month')
            setDefault(dateCells[i]);
        }

        i = start
        j = 0
        for (; j < dateArray.length && i < dateCells.length; i++) {
            j++;
            dateCells[i].innerHTML = dateCellContent(monthNameToNumber[monthButton.value], j);
            dateCells[i].classList.add('current-month')
            setDefault(dateCells[i]);


            if (todayDate == j && todayMonth == monthNameToNumber[monthButton.value] && yearButton.value == todayYear) {
                dateCells[i].classList.add('current-date');
                selectedElement = dateCells[i];
            }
        }

        j = 0
        for (; i < dateCells.length; i++) {
            j++;
            dateCells[i].innerHTML = dateCellContent(monthNameToNumber[monthButton.value], j);
            dateCells[i].classList.add('next-month')
            setDefault(dateCells[i]);
        }
    }

    /**
     * @param event The event generated by a mouse-click on a cell of the calendar
     * @returns {{year, month, date}} An object containing the determined year, month, date
     */

    function determineDateFromCalendar(event) {
        let cell = event.target

        let year = yearButton.value
        let month = monthNameToNumber[monthButton.value]
        let date = cell.querySelector('.GregorianDate');
        date = date.textContent;

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
        return {year, month, date}
    }

    function getCalendarEvents(year, month, date) {
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        const formattedDate = (new Date(year, month, date)).toLocaleDateString('en-US', options);
        $.ajax({
            url: '/calendar-events',
            method: 'POST',
            data: {date: formattedDate}
        })
            .done(function (response) {
                // console.log(response);
                showCalendarEvents(response.tasks)
            })
    }

    function dateCellContent(month, j) {
        let HDate = new HijrahDate(new Date(yearButton.value, month, j))
        return "<p class=\"GregorianDate\">" + j.toString() + "</p>" + "<p class=\"HijriDate\">" + HDate.getDate() + "</p>";
    }


    function showCalendarEvents(tasks) {
        let taskList = $(".task");

        let taskArray = taskList.find("li").toArray(); // Get all existing li elements

        let demoTaskHtml = $(taskArray[0]);
        /**
         * The "demoTaskHtml" is a demo html defined in 'my-calendar.ejs' and 'my-calendar.css'.
         * Now, while adding the tasks to the unordered list,
         * this demo will be cloned for every task, with attributes set properly
         */

        $(taskList).find("li:not(:first-child)").remove();
        //removing all children (li) except the first one, for the demo

        if (tasks == null) return;

        for (let i = 0; i < tasks.length; i++) {
            let task = demoTaskHtml.clone(); //make a copy of it, otherwise it takes reference
            task.removeClass("hidden");
            task.attr("id", `${tasks[i].TASK_ID}`)
            task.find(".task-name").html(`${tasks[i].TASK_NAME}`);
            task.find(".task-time").html(`${tasks[i].START_TIME} - ${tasks[i].END_TIME}`);
            taskList.append(task);
        }

        $(taskList).find(".delete-task-button").each(function (index, button) {
            $(button).click(function (event) {
                $(event.target).parent().parent().remove();
                $.post(`/delete-planned-event/${$(event.target).parent().parent().attr("id")}`, function (response) {
                    if (response.success) {
                        console.log("ok")
                    } else {
                        alert("Could not delete the event. Please try again later.");
                    }
                });
            })

            const planDescriptionModal = $('.description-modal');
            $(button).parent().parent().hover(function () {
                    const liOffset = $(this).offset();
                    const liWidth = $(this).outerWidth();
                    const modalWidth = planDescriptionModal.outerWidth();

                    const modalLeft = liOffset.left - modalWidth - 10; // Adjust as needed
                    const modalTop = liOffset.top;

                    planDescriptionModal.css({left: modalLeft, top: modalTop});
                    planDescriptionModal.addClass('active');
                },
                function () {
                    planDescriptionModal.removeClass('active');
                }
            );
        });
    }
})

function setDefault(element) {
    if (element.classList.contains('previous-month') || element.classList.contains('next-month')) {
        element.style.backgroundColor = "inherit";
    } else if (element.classList.contains('current-date') == false)
        element.style.backgroundColor = "#3c3a3a13";

}


function openModal(year, month, date) {
    let newEvent = document.querySelector("#new-event");
    let overlayInNewEvent = document.querySelector("#overlay-in-new-event");
    let eventDate = document.querySelector("#event-date");
    eventDate.textContent = date + " " + months[month] + ", " + year;
    let inputDate = document.querySelector(".hidden-date");
    inputDate.value = year + "-" + (month + 1) + "-" + date;
    $(newEvent).css("display", "block");
    $(overlayInNewEvent).css("display", "block");
}