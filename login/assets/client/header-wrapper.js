$(() => {
    let profileButton = document.querySelector("#profile-button")
    let profileMenu = document.querySelector("#profile-menu")

    profileButton.addEventListener("click", function () {
        if(profileMenu.style.display !== "none") {
            profileMenu.style.display = "none"
        }
        else {
            profileMenu.style.display = "block"
        }
    })
    document.addEventListener("click", function (event) {
        let eventSource = event.target
        if(!(eventSource.id === profileButton.id || eventSource.id === profileMenu.id)) {
            profileMenu.style.display = "none"
        }
    })
})