
filter = 0; // 0: topic, 1: teacher, 2: link etc
type = "All";
filterType = 0;
searchFilter = document.querySelector('.search-filter');
select = searchFilter.querySelector('select');
radioButton = document.querySelector('.online-offline-filter');
radioButtonEle = document.getElementsByName('radio');
searchFilter.addEventListener('click', () => {
    const idx = select.selectedIndex;
    if(idx == 0 || idx == 1){
        filter = idx;
        filterType = filter;
    }

    if(idx == 2){
       // radioButtonEle[1].checked=true;
        filter = 3;
        filterType = 2;
    }
    else if(idx == 3){
       // radioButtonEle[2].checked=true;
        filter = 3;
        filterType = 3;
    }
    applyType();


});


const listItems = document.querySelectorAll('.info-table');
searchbar = document.querySelector('.searchbar');

var searchbarContent="";
var datePicker = document.querySelector("#search-datepicker");

searchbar.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    searchbarContent = searchTerm;
    
    display(searchbarContent);
});

radioButton.addEventListener('input', function (event) {
    const btnValue = event.target.value;
    type = btnValue;
    applyType();
});

function applyType(){
    if(type == "Online"){
        if(select.selectedIndex==3){
            select.selectedIndex=0;
            //type = "All";
            filter=0;
            filterType = 0;
        }
        select[2].disabled=false;
        select[3].disabled=true;
    }
    else if(type == "Offline"){
        if(select.selectedIndex==2){
            select.selectedIndex=0;
            //type="All";
            filter = 0;
            filterType = 0;
        }
        select[2].disabled=true;
        select[3].disabled=false;
    }
    else if(type =="All"){
        select[2].disabled=false;
        select[3].disabled=false;
    }
    
    display(searchbarContent);
    
}

function showClass(filterType, itemType){
    if(filterType==2 && itemType!="Online") return false;
    if(filterType==3 && itemType!="Offline") return false;
    return true;
}
function IsEqual(date1, date2){
    return (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()
     && date1.getFullYear() == date2.getFullYear());
}

function display(searchTerm){
    listItems.forEach(function (item) {
        const itemRow = item.getElementsByTagName("tr")[filter];
        const itemData = itemRow.querySelector('.value');
        const itemText = itemData.textContent.toLowerCase();
        //console.log(itemText);
        const itemTypeRow = (item.getElementsByTagName("tr")[2]);
        const itemType = itemTypeRow.querySelector('.value').textContent;
        const classDate = item.getElementsByTagName("tr")[4];
        const classDateVal = new Date((classDate.querySelector('.value')).textContent);

        const datePickerVal = new Date(datePicker.value);

        if(!showClass(filterType, itemType))
            item.parentNode.style.display = 'none';
        else if ((IsEqual(classDateVal, datePickerVal) || datePicker.value == "") && (itemText.indexOf(searchTerm) !== -1 || searchTerm=="")  && (itemType == type || type=="All")) 
            item.parentNode.style.display = 'list-item';
        else 
            item.parentNode.style.display = 'none';
    });
}





// function padTo2Digits(num) {
//     return num.toString().padStart(2, '0');
//   }

function formatDate(date = new Date()) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
  }

//   datePicker.value = formatDate();
  
  datePicker.addEventListener("change", (event) => {
      display(searchbarContent);
});