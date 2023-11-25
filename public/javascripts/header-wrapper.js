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

    function openNotificationPanel() {
        bellIcon.selected = true;
        $(".bell-icon-inner").show();
        $(".notification-panel").removeClass("hidden");
    }

    function closeNotificationPanel() {
        bellIcon.selected = false;
        $(".bell-icon-inner").hide();
        $(".notification-panel").addClass("hidden");
    }

    bellIcon.click(function () {
        if (!bellIcon.selected) {
            openNotificationPanel()
        } else {
            closeNotificationPanel();
        }
    })

    setInterval(checkForNotifications, 1000);

    let count = 0;

    async function checkForNotifications() {
        $.post("check-for-notifications", function (response) {
            if(response.data) {
                console.log(response.data);
                updateNotifications();
            }
        })
    }

    function updateNotifications() {
        let notificationList = $(".notification-list");
        let notificationArray = notificationList.find("li").toArray(); // Get all existing li elements

        // Create a new li element using jQuery
        let notification = $(notificationArray[0]).clone();

        notification.find('p').text(`${++count} isaugfvisgekyieds vdgfvydeg bsfvgiydesggb iuyv dsyfesdbcdsjbvydefve`);
        notification.removeClass("hidden");

        notification.addClass("salah-reminder");
        notification.click(function (event) {
            if (event.target.className == "salah-reminder") {
                if (window.location.pathname != "/prayer-times") {
                    window.location.href = "/prayer-times";
                } else {
                    closeNotificationPanel();
                }
            }
        })

        notificationList.append(notification);
    }
})