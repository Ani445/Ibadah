
$("#otpform").validate({
    rules:{
    },
    messages: {
        otp: {
            required: "Please enter the OTP"
        },
    },
    submitHandler: function(form){
        window.location.href = '/otp';
        $.ajax({
            type: $(form).attr('method'),
            url: $(form).attr('action'),
            data: $(form).serialize(),
            dataType : 'json'
        })
        .done(function (response) {
            if (response.success == 1) {    //success            
                window.location.href = '/home';
            } else {
                alert('Wrong OTP');
            }
        });
        return false; // required to block normal submit since you used ajax
    }
});

$("#form").validate({
    rules:{
        username:{
            minlength: 2
        },
        email:{
            email: true
        },
        password:{
            minlength: 2
        },
        confirm_password:{
            equalTo: "#password"
        }
    },
    messages: {
        username: {
            required: "Please enter a username",
            minlength: "Username should be at least 2 characters"//also taken username
        },
        email: {
            required: "Please enter your email"

        },
        password:{
            required: "Please enter a password",
            minlength: "Password should be at least 8 characters"
        },
        confirm_password:{
            required: "Please enter a password",
            equalTo: "Password didn't match"
        }
    },
    submitHandler: function(form){
        $.ajax({
            type: $(form).attr('method'),
            url: $(form).attr('action'),
            data: $(form).serialize(),
            dataType : 'json'
        })
        .done(function (response) {
            if (response.success == 1) {    //success            
                window.location.href = '/otp';
            } else {
                alert('An account with this email already exists');
            }
            console.log(response.otp);
        });
        return false; // required to block normal submit since you used ajax
    }
});
