$(() => {
    let profileButton = document.querySelector("#profile-button")
    let profileMenu = document.querySelector("#profile-menu")

    $(profileButton).mousedown(function (event) {
        if (event.which !== 1) return
        profileButton.classList.add('pressed')
        if (profileMenu.style.display !== "none") {
            profileMenu.style.display = "none"
        } else {
            profileMenu.style.display = "block"
        }
    })
    $(profileButton).mouseup(function () {
        profileButton.classList.remove('pressed')
    })
    document.addEventListener("click", function (event) {
        let eventSource = event.target
        if (!(eventSource.id === profileButton.id || eventSource.id === profileMenu.id)) {
            profileMenu.style.display = "none"
        }
    })

    $.ajax({
        type: "POST",
        url: "/get-username",
        dataType: "json"
    })
        .done(function (res) {
            profileButton.textContent = res.username
        });

    let bellIcon = $(".bell-icon");
    let notificationListContainer = $(".notification-list-container");

    bellIcon.click(function () {
        if (!bellIcon.selected) {
            bellIcon.selected = true;
            $(".bell-icon-inner").show();
            $(".notification-panel").removeClass("hidden");
        } else {
            bellIcon.selected = false;
            $(".bell-icon-inner").hide();
            $(".notification-panel").addClass("hidden");
        }
    })

    setInterval(checkForNotifications, 1000);

    async function checkForNotifications() {
        $.post("check-for-notifications", function (response) {
            updateNotifications();
        })
    }

    let count = 0;
    function updateNotifications() {
        let notificationList = $(".notification-list").find("li").toArray(); // Get all existing li elements

        // Create a new li element using jQuery
        let firstNotification = $(notificationList[0]).clone();

        firstNotification.find('p').text(`${++count}`);

        // Append the new li element to the DOM before adding it to the array
        $(".notification-list").append(firstNotification);
    }

})