
filter = 0; // topic, teacher, link etc
type = "All";
typeVal = 2;
searchFilter = document.querySelector('.search-filter');
select = searchFilter.querySelector('select');
radioButton = document.querySelector('.online-offline-filter');

searchFilter.addEventListener('click', () => {
    const idx = select.selectedIndex;
    if(idx == 0 || idx == 1){
        filter = idx;
    }

    if(idx == 2){
        type = "Online";
        filter = 3;
        applyType();
    }
    else if(idx == 3){
        type = "Offline"; 
        filter = 3;
        applyType();
    }


});


const listItems = document.querySelectorAll('.info-table');
searchbar = document.querySelector('.searchbar');
searchbar.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();

    listItems.forEach(function (item) {
        itemRow = item.getElementsByTagName("tr")[filter];
        itemData = itemRow.querySelector('.value');
        const itemText = itemData.textContent.toLowerCase();
        console.log(itemText);
        itemTypeRow = (item.getElementsByTagName("tr")[typeVal]);
        itemType = itemTypeRow.querySelector('.value').textContent;
        if (itemText.indexOf(searchTerm) !== -1  && (itemType == type || type=="All")) {
            item.parentNode.style.display = 'list-item';
        } else {
            item.parentNode.style.display = 'none';
        }
    });
});

radioButton.addEventListener('input', function (event) {
    const btnValue = event.target.value;
    type = btnValue;
    applyType();
});

function applyType(){

    listItems.forEach(function (item) {

        listItems.forEach(function (item) {
            itemTypeRow = (item.getElementsByTagName("tr")[typeVal]);
            itemType = itemTypeRow.querySelector('.value').textContent;
            if(type == itemType || type=="All"){
                item.parentNode.style.display = 'list-item';
            } else {
                item.parentNode.style.display = 'none';
            }
        });
    });
}