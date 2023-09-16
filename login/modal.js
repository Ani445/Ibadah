$(document).ready(function() {
    // Function to open the modal
    function openModal() {
        $("#new-class").css("display", "block");
        $("#overlay-in-new-class").css("display", "block");
    }

    // Function to close the modal
    function closeModal() {
        $("#new-class").css("display", "none");
        $("#overlay-in-new-class").css("display", "none");
    }

    // Open the modal when the button is clicked
    $("#openModalBtn").click(function() {
        openModal();
    });

    // Close the modal when the close button is clicked
    $("#close").click(function() {
        closeModal();
    });

    // Close the modal when clicking outside the modal content or overlay
    $("#overlay-in-new-class").click(function() {
        closeModal();
    });

    $("#new-class").click(function(event) {
        // Prevent clicks within the modal from closing it
        event.stopPropagation();
    });

    // Handle form submission using AJAX (as shown in previous code)
    $("#add-new-class-form").submit(function(event) {
        event.preventDefault();
        // ... AJAX request and handling code
    });
});
