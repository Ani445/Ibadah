$(() => {

// Handle form submission using AJAX (as shown in previous code)
    $("#postForm").validate({
        rules: {},
        messages: {
            paiso: {
                required: "Please type something."
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
                    if (response.success === 1) {    //success
                        window.location.href = '/forum'
                    } else {
                        // window.location.href='/classes'
                        alert('Something went wrong');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    });


    $("#postComment").validate({
        rules: {},
        messages: {
            commented: {
                required: "Please type something."
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
                    if (response.success === 1) {    //success
                        window.location.href = '/forum'
                    } else {
                        // window.location.href='/classes'
                        alert('Something went wrong');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    });
})
