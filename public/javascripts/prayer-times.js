const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

document.addEventListener('DOMContentLoaded', function () {
    let monthButton = document.querySelector("#month")
    let yearButton = document.querySelector("#year")
    let yearUpButton = document.querySelector("#year-up")
    let yearDownButton = document.querySelector("#year-down")

    let monthPickerContainer = document.querySelector("#month-picker-container")
    monthButton.value = months[new Date().getMonth()]
    yearButton.value = new Date().getFullYear()


    let monthValue = document.getElementsByClassName('month-name')

    yearUpButton.addEventListener('click', function () {
        yearButton.value++
    })
    yearDownButton.addEventListener('click', function () {
        yearButton.value--
    })

    for (let i = 0; i < monthValue.length; i++) {
        monthValue[i].addEventListener('click', function () {
            monthButton.value = monthValue[i].textContent
        });
    }

    document.addEventListener('click', function (event) {
        if(event.target.id !== monthButton.id) {
            closeMonthPicker()
        }
        else if(monthPickerContainer.style.display === 'none') {
            openMonthPicker()
        }
        else {
            closeMonthPicker()
        }
    })

    function openMonthPicker() {
        monthPickerContainer.style.display = 'block'
    }
    function closeMonthPicker() {
        monthPickerContainer.style.display = 'none'
    }
})