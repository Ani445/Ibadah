$(document).ready(function () {
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
    $("#add-new-class-button").click(function () {
        openModal();
    });

    // Close the modal when the close button is clicked
    $("#close").click(function () {
        closeModal();
    });

    // Close the modal when clicking outside the modal content or overlay
    $("#overlay-in-new-class").click(function () {
        closeModal();
    });

    $("#new-class").click(function (event) {
        // Prevent clicks within the modal from closing it
        event.stopPropagation();
    });



    // Handle form submission using AJAX (as shown in previous code)
    $("#new-class-form").validate({
        rules:{
            
        },
        messages: {
           
        },
        submitHandler: function(form){
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType : 'json'
            })
            .done(function (response) {
                if (response.success === 1) {    //success
                    window.location.href='/classes'
                } else {
                    // window.location.href='/classes'
                    alert('Something went wrong');
                }
            });
            return false; // required to block normal submit since you used ajax
        },
    });
});
