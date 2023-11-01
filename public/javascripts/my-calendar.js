
var selectedElement;
document.addEventListener('DOMContentLoaded', function () {
    // alert(writeIslamicDate(-1,new Date(2020,6,22)));
    /*for the task panel header*/
    currentDate = document.querySelector('.Today >.en');
    currentDate.innerHTML ="<span>"+ new Date().getDate().toString()+" "+months[new Date().getMonth()].substring(0, 3) + " "+new Date().getFullYear().toString()+"</span>";

    currentArabicDate = document.querySelector('.Today > .ar');
    currentArabicDate.innerHTML = "<span>"+ new HijrahDate(new Date()) +"</span>"
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
        // dateCells[i].innerHTML = ""
        dateCells[i].addEventListener('click', function (event) {
            if(selectedElement == dateCells[i])return;
            let {year, month, date} = determineDateFromCalendar(event)
            getCalendarEvents(year, month, date)
            //console.log({year, month, date})
            
            /*for the task panel header*/
            currentDate.innerHTML ="<span>"+date+" "+months[month].substring(0, 3) + " "+year+"</span>";

            currentArabicDate.innerHTML = "<span>"+ new HijrahDate(new Date(year,month,date)) +"</span>"
            /***************************/
           
            /*coloring current date*/
            if(selectedElement!=dateCells[i]){
                if(selectedElement != null)setDefault(selectedElement);
                if(dateCells[i].classList.contains('current-date')==false)
                {
                    dateCells[i].setAttribute('style','background-color: #e5def1;')
                    selectedElement = dateCells[i];
                    
                }
                
            }
                
            /***********************/
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

    // function getDays(month, year) {
    //     const settings = {
    //         async: true,
    //         crossDomain: true,
    //         url: `http://api.aladhan.com/v1/gToHCalendar/${month + 1}/${year}`,
    //         method: 'GET'
    //     }

    //     $.ajax(settings).done(function (response) {
    //         let dates =
    //             {
    //                 GregorianDay: null,
    //                 GregorianWeekday: null,
    //                 GregorianMonth: null,
    //                 HijriDay: null,
    //                 HijriEnglishWeekday: null,
    //                 HijriArabicWeekday: null
    //             };
    //         let dateArr = [];

    //         for (let i = 0; response.data[i] != null; i++) {
    //             data = response.data[i];
    //             // console.log(response.data)

    //             dates.GregorianDay = data["gregorian"]["day"];
    //             dates.GregorianMonth = data["gregorian"]["month"]["number"];
    //             dates.GregorianMonthName = data["gregorian"]["month"]["en"];
    //             dates.GregorianYear = data["gregorian"]["year"];
    //             dates.GregorianWeekday = data["gregorian"]["weekday"]["en"];
    //             dates.HijriDay = data["hijri"]["day"];
    //             dates.HijriEnglishWeekday = data["hijri"]["weekday"]["en"];
    //             dates.HijriArabicWeekday = data["hijri"]["weekday"]["ar"];

    //             dateArr.push({...dates});
    //         }
    //         console.log(dateArr);
    //         populateCalendar(dateArr)
    //     });
    // }
    
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
        // console.log(dateArray);
        populateCalendar(dateArray);
      }

    function populateCalendar(dateArray) {
        // let start = weekdays[dateArray[0].GregorianWeekday]
        let start = dateArray[0].GregorianWeekday;

       let dateCells = document.getElementsByClassName('date-cell')

        for (let i = 0; i < dateCells.length; i++) {
            dateCells[i].innerHTML = "";
            dateCells[i].classList.remove('previous-month')
            dateCells[i].classList.remove('next-month')
            dateCells[i].classList.remove('current-month')  
            dateCells[i].classList.remove('current-date')
        }
        
        // let j = new Date(dateArray[0].GregorianYear, dateArray[0].GregorianMonth - 1, 0).getDate()
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
            
            /*coloring current data*/
            if(new Date().getDate() == j && new Date().getMonth()==monthNameToNumber[monthButton.value] && yearButton.value == new Date().getFullYear())
            {
                dateCells[i].classList.add('current-date');
                selectedElement = dateCells[i];
            }
            // else dateCells[i].classList.remove('current-date');
            /**************************/
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
     *
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
        // month++ // to make the year 1 index, to use in the API
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
    function InnerContent(month,j){
         return "<p class=\"GregorianDate\">"+j.toString()+"</p>"+"<p class=\"HijriDate\">"+new HijrahDate(new Date(yearButton.value,month,j)).getDate()+"</p>";
    }
})



function setDefault(element)
{
    if(element.classList.contains('previous-month') || element.classList.contains('next-month')){
        element.setAttribute('style','background-color: inherit;')
    }
    else if(element.classList.contains('current-date')==false)
        element.setAttribute('style','background-color: #e7e7e7;')
    
    
}
