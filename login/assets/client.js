const wrapper=document.querySelector('.wrapper');
const loginLink=document.querySelector('.login-link');

const registerLink=document.querySelector('.register-link');
// const signup_form = document.querySelector('.form-box signup');

if(registerLink) {
    registerLink.addEventListener('click',()=>{
        wrapper.classList.add('active');
    });
}

if(loginLink) {
    loginLink.addEventListener('click',()=>{
        wrapper.classList.remove('active');
    });
}

$(document).on('click', '#forgot_pass_button', ()=>{
    window.location.href = "/mailverify";
})

$(document).ready(() => {
    console.log(window.location.href);
    if(window.location.pathname=='/signup'){
        wrapper.classList.add('active');
        // $(signup_form).attr('transition','none');
        // console.log( $(wrapper).attr('height'))
    }
});


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

$("#signup_form").validate({
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
            equalTo: "#signup-password"
        }
    },
    messages: {
        username: {
            minlength: "Username should be at least 2 characters"//also taken username
        },
        email: {            

        },
        password:{
           
            minlength: "Password should be at least 8 characters"
        },
        confirm_password:{
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
            // console.log(response.otp);
        });
        return false; // required to block normal submit since you used ajax
    }
});


$("#signin_form").validate({
    rules:{
        
    },
    messages: {
       
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

$("#mail_forgotpass_form").validate({
    rules:{
        email: true
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
