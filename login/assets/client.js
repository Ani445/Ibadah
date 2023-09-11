
$("#otpform").validate({
    rules:{
    },
    messages: {
        otp: {
            required: "Please enter the OTP"
        },
    },
    submitHandler: function(form){
        // window.location.href = '/otp';
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
            minlength: 8
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


$("#signin-form").validate({
    rules:{
        
    },
    messages: {
        email: {
            required: "Please enter your email"

        },
        password:{
            required: "Please your a password"
        },
    },
    submitHandler: function(form){
        // window.location.href = '/forgotpassotp';
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
                alert('Wrong email or password');
            }
        });
        return false; // required to block normal submit since you used ajax
    },
});

$("#signin-form").validate({
    rules:{
        
    },
    messages: {
        email: {
            required: "Please enter your email"

        },
        password:{
            required: "Please your a password"
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
                window.location.href = '/home';
            } else {
                alert('Wrong email or password');
            }
        });
        return false; // required to block normal submit since you used ajax
    },
});

$("#mail_forgotpass_form").validate({
    rules:{
        
    },
    messages: {
        email: {
            required: "Please enter your email"
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
                window.location.href = '/forgotpassotp';
            } else {
                alert('No account found with this email');
            }
        });
        return false; // required to block normal submit since you used ajax
    },
});

$("#otp_forgotpass_form").validate({
    rules:{
        
    },
    messages: {
        email: {
            required: "Please enter The OTP"
        },
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
                window.location.href = '/changepass';
            } else {
                alert('Wrong OTP');
            }
        });
        return false; // required to block normal submit since you used ajax
    },
});

$("#change_pass_form").validate({
    rules:{
        new_password:{
            minlength: 8
        },
        confirm_new_password:{
            equalTo: "#new_password"
        }
    },
    messages: {
        new_password: {
            required: "Please enter The Password",
            minlength: "Password should be at least 8 characters"
        },
        new_password: {
            required: "Please Repeat The Password"
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
                window.location.href = '/home';
            } else {
                alert('Could not change the password');
            }
        });
        return false; // required to block normal submit since you used ajax
    },
});

$(document).ready(() => {
    $.ajax({
        url: '/load-classes',
        method: 'get',
        success: function(data) {
            $("#class_list").html(data);
        }
    })
});

$(document).on('click', '#go_signup_button', ()=>{
    window.location.href = "/signup";
})

$(document).on('click', '#go_signin_button', ()=>{
    window.location.href = "/signin";
})

$(document).on('click', '#forgot_pass_button', ()=>{
    window.location.href = "/mailverify";
})

// $(document).on('click', '#enter_email_button', ()=>{
//     window.location.href = "/mailverify";
// })
