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
    
    $(".option-buttons .delete-button").each(function (index, button) {
        $(button).click(function () {
            let li = $(button).parent().parent().parent();
            let id = li.attr("id");
            li.remove();
            $.post(`/delete-post/${id}`, function (response) {
                console.log("class deleted");
            })
        })
    });
})
