
var selectedElement;
document.addEventListener('DOMContentLoaded', function () {

    currentDate = document.querySelector('.Today >.en');
    let todayDate = new Date().getDate();
    let todayMonth = new Date().getMonth();
    let todayYear = new Date().getFullYear();
    
    currentDate.innerHTML ="<span>" + todayDate + " " + months[todayMonth].substring(0, 3) + " " + todayYear + "</span>";
    currentArabicDate = document.querySelector('.Today > .ar');
    currentArabicDate.innerHTML = "<span>"+ new HijrahDate(new Date()).format('longDate', 'en') +"</span>";

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
            if(selectedElement == dateCells[i])return;

            let {year, month, date} = determineDateFromCalendar(event)
            
            currentDate.innerHTML ="<span>" + date + " " + months[month].substring(0, 3) + " " + year + "</span>";

            currentArabicDate.innerHTML = "<span>" + new HijrahDate(new Date(year, month, date)).format('longDate', 'en') +"</span>"
            
            if(selectedElement != null)setDefault(selectedElement);
            if(dateCells[i].classList.contains('current-date')==false)
            {
                // selectedElement.classList.remove('.selected');
                dateCells[i].style.backgroundColor = "#e5def1";
                selectedElement = dateCells[i];                    
            }
            getCalendarEvents(year, month, date);        
            
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
        let date = new Date(year, month,1);
        let dateObj={
            GregorianDay: date.getDate(),
            GregorianWeekday: date.getDay(),
            GregorianMonth: month,
            GregorianYear: year
        }
        let dateArray = [];
        while (date.getMonth() === month) {
          dateArray.push({...dateObj});
          date.setDate(date.getDate() + 1);
          dateObj.GregorianDay=date.getDate();
          dateObj.GregorianWeekday=date.getDay();
          dateObj.GregorianMonth= month;
          dateObj.GregorianYear=year;
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
            dateCells[i].innerHTML = InnerContent(monthNameToNumber[monthButton.value]-1,j);
            j--;
            dateCells[i].classList.add('previous-month')
            setDefault(dateCells[i]);
        }
        
        i = start
        j = 0
        for (; j < dateArray.length && i < dateCells.length; i++) {
            j++;
            dateCells[i].innerHTML = InnerContent(monthNameToNumber[monthButton.value],j);
            dateCells[i].classList.add('current-month')
            setDefault(dateCells[i]);
            

            if(todayDate == j && todayMonth == monthNameToNumber[monthButton.value] && yearButton.value == todayYear)
            {
                dateCells[i].classList.add('current-date');
                selectedElement = dateCells[i];
            }
        }
        
        j = 0
        for (; i < dateCells.length; i++) {
            j++;            
            dateCells[i].innerHTML = InnerContent(monthNameToNumber[monthButton.value],j);
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
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = (new Date(year, month, date)).toLocaleDateString('en-US', options);
        $.ajax({
            url: '/calendar-events',
            method: 'POST',
            data: {date: formattedDate}
        })
        .done(function (response) {
            console.log(response);
            showCalendarEvents(response.tasks)
        })
    }

    function InnerContent(month,j){
         HDate = new HijrahDate(new Date(yearButton.value,month,j))
         return "<p class=\"GregorianDate\">" + j.toString()+ "</p>" +"<p class=\"HijriDate\">"+ HDate.getDate()+"</p>";
    }

    // $.ajax({
    //     url: '/calendar-events',
    //     method: 'POST',
    //     data: {date: formattedDate},
    //     dataType: 'json'
    // })
    // .done(function (response) {
    //     console.log(response);
    //     showCalendarEvents(response.tasks);
    // })

    function showCalendarEvents(tasks){
        let taskList = document.querySelector('.task');
        taskList.innerHTML="";
        for(let i =0 ;i<tasks.length ; i++){
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(tasks[i].TASK_NAME));
            taskList.appendChild(li);
        }
    }

})



function setDefault(element)
{
    if(element.classList.contains('previous-month') || element.classList.contains('next-month')){
        element.style.backgroundColor = "inherit";
    }
    else if(element.classList.contains('current-date')==false)
        element.style.backgroundColor = "#e7e7e7";
       
}
