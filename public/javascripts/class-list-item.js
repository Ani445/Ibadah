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
searchbar = document.querySelector('.searchbar');
// searchbar.addEventListener('input', function (event) {
//     const searchTerm = event.target.value.toLowerCase();
//     const listItems = document.querySelectorAll('.card--container');

//     listItems.forEach(function (item) {
//         const itemText = item.topic.toLowerCase();

//         if (itemText.includes(searchTerm)) {
//             item.style.display = 'list-item';
//         } else {
//             item.style.display = 'none';
//         }
//     });
// });