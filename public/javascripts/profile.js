$(() => {
    var fullNameText = document.querySelector("#full-name")
    var editNameButton = document.querySelector("#edit-name-button")
    var editName= document.querySelector("#edit-name")
    var saveName = document.querySelector("#save-name")
    var nameSavedLabel = document.querySelector("#name-saved-label")
    var userProfileContainer = document.querySelector(".user-profile-container")

    editNameButton.addEventListener('click', () => {
        enableNameEdit()
    })
    userProfileContainer.addEventListener('click', () => {
        var nameSavedLabel = document.querySelector("#name-saved-label")
        var emailSavedLabel = document.querySelector("#email-saved-label")
        nameSavedLabel.classList.remove('active')
        emailSavedLabel.classList.remove('active')
    })

    function enableNameEdit() {
        editName.style.display = "none"
        saveName.style.display = "block"
        fullNameText.disabled = false
    }

    function disableNameEdit() {
        editName.style.display = "inline"
        saveName.style.display = "none"
        fullNameText.disabled = true
        nameSavedLabel.classList.add("active")
    }

    $("#edit-name-form").validate({
        rules: {
            fullName: {
                
            }
        },
        messages: {
            fullName: {
                required: "Please enter your name"
            }
        },
        submitHandler: function (form) {
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success == 1) {    //success            
                        disableNameEdit()
                    } else {
                        alert('');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })



    var emailText = document.querySelector("#email")
    var editEmailButton = document.querySelector("#edit-email-button")
    var editEmail= document.querySelector("#edit-email")
    var saveEmail = document.querySelector("#save-email")
    var emailSavedLabel = document.querySelector("#email-saved-label")
    var otpform = document.querySelector("#change-email-otp-form")
    var editEmailForm = document.querySelector("#edit-email-form")


    editEmailButton.addEventListener('click', () => {
        enableEmailEdit()
    })
   
    function enableEmailEdit() {
        editEmail.style.display = "none"
        saveEmail.style.display = "block"
        emailText.disabled = false
    }

    function displayOTP() {
        otpform.style.display = "block"
        editEmailForm.style.display = "none"
    }

    function disableEmailEdit() {
        otpform.style.display = "none"
        editEmailForm.style.display = "block"

        editEmail.style.display = "inline"
        saveEmail.style.display = "none"
        emailText.disabled = true
        emailSavedLabel.classList.add("active")
    }

    $("#edit-email-form").validate({
        rules: {
            fullName: {
                
            }
        },
        messages: {
            email: {
                required: "Please enter your email"
            }
        },
        submitHandler: function (form) {
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success == 1) {    //success            
                        displayOTP()
                    } else {
                        alert('');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })


    $("#change-email-otp-form").validate({
        rules: {
            otp: {
                
            }
        },
        messages: {
            otp: {
                required: "Please enter the OTP"
            }
        },
        submitHandler: function (form) {
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success == 1) {    //success            
                        disableEmailEdit()
                    } else {
                        alert('');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })
})