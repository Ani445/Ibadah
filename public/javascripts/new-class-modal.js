$(() => {
    let classLinkDiv = document.querySelector("#class-link-div")
    let classAddressDiv = document.querySelector("#class-address-div")
    let mediumSelect = document.querySelector(".new-class-input select")

    mediumSelect.value = mediumSelect.options[0].value

    mediumSelect.addEventListener('change', function () {
        if(mediumSelect.value === mediumSelect.options[0].value) {
            classLinkDiv.style.display = "block"
            classAddressDiv.style.display = "none"
        }
        else if(mediumSelect.value === mediumSelect.options[1].value) {
            classLinkDiv.style.display = "none"
            classAddressDiv.style.display = "block"
        }
    })


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
})