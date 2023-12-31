$(() => {
    function updateNotifications(notifications) {
        let htmlNotificationList = $(".notification-list");
        let htmlNotificationArray = htmlNotificationList.find("li").toArray(); // Get all existing li elements

        $(htmlNotificationList).find("li:not(:first-child)").remove()

        console.log(notifications.length);

        // Create a new li element using jQuery
        let htmlNotificationDemo = $(htmlNotificationArray[0]);

        for (let i = 0; i < notifications.length; i++) {
            let n = notifications[i];
            let type = n.WHAT_FOR.split("-");
            let newHtmlNotification = htmlNotificationDemo.clone();
            if (type[0] === "prayer") {
                if (type[2] === "started") {
                    newHtmlNotification.find('p').text(`Your ${type[1]} prayer has started`);
                    newHtmlNotification.removeClass("hidden");
                } else {
                    newHtmlNotification.find('p').text(`Your ${type[1]} prayer will start in ${type[2]} minutes.`);
                    newHtmlNotification.removeClass("hidden");
                }
            }

            newHtmlNotification.addClass("salah-reminder");
            newHtmlNotification.click(function (event) {
                if (event.target.className == "salah-reminder") {
                    if (window.location.pathname != "/prayer-times") {
                        window.location.href = "/prayer-times";
                    } else {
                        closeNotificationPanel();
                    }
                }
            })
            htmlNotificationList.append(newHtmlNotification);
        }
    }

    async function checkForNotifications() {
        $.post("check-for-notifications", function (response) {
            if (response.data) {
                // console.log(response.data);
                updateNotifications(response.data);
            }
        })
    }

    setInterval(checkForNotifications, 3500000);
    checkForNotifications();

    let profileButton = document.querySelector("#profile-button")
    let profileMenu = document.querySelector("#profile-menu")

    $(profileButton).click(function (event) {
        if (event.which !== 1) return
        if (profileMenu.style.display !== "none") {
            profileMenu.style.display = "none"
        } else {
            profileMenu.style.display = "block"
            $(profileMenu).css("top", $(this).position().top + $(this).height() * 1.25);
            $(profileMenu).css("left", $(this).position().left * .80);
            console.log($(this).position())
            console.log($(profileMenu).position())
        }
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
})