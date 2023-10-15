let listItems=[];
$(document).ready(function () {
    $.ajax({
        type: 'get',
        async: false,
        url: '/class-list',
        dataType: 'json'
    })
    .done(function (response) {
        listItems.push(response.data);
        console.log(listItems);
    });
});

type = 0;

searchFilter = document.querySelector('.search-filter');

searchbar = document.querySelector('.searchbar');
searchbar.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const listItems = document.querySelectorAll('.info-table');

    listItems.forEach(function (item) {
        itemRow = item.getElementsByTagName("tr")[type]; 
        itemData = itemRow.querySelector('.value');
        const itemText = itemData.textContent.toLowerCase();

        if (itemText.includes(searchTerm)) {
            item.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
});