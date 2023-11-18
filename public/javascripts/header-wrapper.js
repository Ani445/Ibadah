$(() => {
    let profileButton = document.querySelector("#profile-button")
    let profileMenu = document.querySelector("#profile-menu")

    $(profileButton).mousedown(function (event) {
        if(event.which !== 1) return
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

    bellIcon.click(function () {
        if(!bellIcon.selected) {
            bellIcon.selected = true;
            $(".bell-icon-inner").show();
            $(".notification-list").removeClass("hidden");
        } else {
            bellIcon.selected = false;
            $(".bell-icon-inner").hide();
            $(".notification-list").addClass("hidden");
        }
    })
})