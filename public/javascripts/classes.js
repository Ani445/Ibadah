$(document).ready(function () {
    let newClass = document.querySelector("#new-class")
    let overlayInNewClass = document.querySelector("#overlay-in-new-class")
    let addNewClassButton = document.querySelector("#add-new-class-button")


    // Function to open the modal
    function openModal() {
        $(newClass).css("display", "block");
        $(overlayInNewClass).css("display", "block");
    }

    // Function to close the modal
    function closeModal() {
        $(newClass).css("display", "none");
        $(overlayInNewClass).css("display", "none");
    }

    // Open the modal when the button is clicked
    $(addNewClassButton).click(function () {
        openModal();
    });

    // Close the modal when clicking outside the modal content or overlay
    $(overlayInNewClass).click(function () {
        closeModal();
    });

    $(newClass).click(function (event) {
        // Prevent clicks within the modal from closing it
        event.stopPropagation();
    });
    $(document).keydown(function (event) {
        if(event.key === "Escape") {
            closeModal()
        }
    })
});
