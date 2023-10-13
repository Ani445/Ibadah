// const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// ];

// document.addEventListener('DOMContentLoaded', function () {
//     let monthButton = document.querySelector("#month")
//     let yearButton = document.querySelector("#year")
//     let yearUpButton = document.querySelector("#year-up")
//     let yearDownButton = document.querySelector("#year-down")

//     let monthPickerContainer = document.querySelector("#month-picker-container")
//     monthButton.value = months[new Date().getMonth()]
//     yearButton.value = new Date().getFullYear()


//     let monthValue = document.getElementsByClassName('month-name')

//     yearUpButton.addEventListener('click', function () {
//         yearButton.value++
//     })
//     yearDownButton.addEventListener('click', function () {
//         yearButton.value--
//     })

//     for (let i = 0; i < monthValue.length; i++) {
//         monthValue[i].addEventListener('click', function () {
//             monthButton.value = monthValue[i].textContent
//         });
//     }

//     document.addEventListener('click', function (event) {
//         if(event.target.id !== monthButton.id) {
//             closeMonthPicker()
//         }
//         else if(monthPickerContainer.style.display === 'none') {
//             openMonthPicker()
//         }
//         else {
//             closeMonthPicker()
//         }
//     })

//     function openMonthPicker() {
//         monthPickerContainer.style.display = 'block'
//     }
//     function closeMonthPicker() {
//         monthPickerContainer.style.display = 'none'
//     }
// })

function getDays(month="October", year="2023"){
   
    const settings = {
        async: true,
        crossDomain: true,
        url: `http://api.aladhan.com/v1/gToHCalendar/:${month}/:${year}`,
        method: 'GET'
    }

    $.ajax(settings).done(function (response) {
        //  console.log(response.data[0].timings.Fajr);
      
        let dates =
            {
                GregorianDay: null,
                GregorianWeekday: null,
                HijriDay: null,
                HijriEnglishWeekday: null,
                HijriArabicWeekday: null
            };
            let dateArr=[];
            for(let i=0;response.data[i]!=null;i++)
            {
                data = response.data[i];
                dates.GregorianDay = data["gregorian"]["day"];
                dates.GregorianWeekday = data["gregorian"]["weekday"]["en"];
                dates.HijriDay = data["hijri"]["day"];
                dates.HijriEnglishWeekday = data["hijri"]["weekday"]["en"];
                dates.HijriArabicWeekday = data["hijri"]["weekday"]["ar"];

                dateArr.push({...dates});
            }
            console.log(dateArr);
    });
}


