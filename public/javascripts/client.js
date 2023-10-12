const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');

const registerLink = document.querySelector('.register-link');
// const signup_form = document.querySelector('.form-box signup');

if (registerLink) {
    registerLink.addEventListener('click', () => {
        wrapper.classList.add('active');
    });
}

if (loginLink) {
    loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
    });
}

$(document).on('click', '#forgot_pass_button', () => {
    window.location.href = "/mailverify";
})

function getPrayerTimes(location, year, month) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `http://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${location.city},${location.country}&method=2`,
        method: 'GET'
    }

    $.ajax(settings).done(function (response) {
        let timings = response.data[0]["timings"]
        const prayerTime =
            {
                Fajr: timings["Fajr"],
                Dhuhr: timings["Dhuhr"],
                Asr: timings["Asr"],
                Maghrib: timings["Maghrib"],
                Isha: timings["Isha"]
            };
        $.ajax({
            type: 'POST',
            url: '/setPrayerTimeSession',
            data: prayerTime,
            dataType: 'json'
        })
            // console.log(prayerTime);
            .done(function (response) {
                console.log('Done');
            });
    });
}

function sendLocationToServer(location) {
    $.ajax({
        type: 'post',
        url: '/set-user-location',
        data: location,
        dataType: 'json'
    })
}

$(() => { //When Login Page is ready
    if (window.location.pathname === '/register') {
        wrapper.classList.add('active');
        // $(signup_form).attr('transition','none');
        // console.log( $(wrapper).attr('height'))
    }

    if (window.location.pathname === '/login') {
        getCoordinates(function (location) {
            sendLocationToServer(location)
            getPrayerTimes(location, new Date().getFullYear(), new Date().getMonth());
        });
    }
});


$("#otpform").validate({
    rules: {},
    messages: {
        otp: {
            required: "Please enter the OTP"
        },
    },
    submitHandler: function (form) {
        // window.location.href = '/otp';
        $.ajax({
            type: $(form).attr('method'),
            url: $(form).attr('action'),
            data: $(form).serialize(),
            dataType: 'json'
        })
            .done(function (response) {
                if (response.success === 1) {    //success
                    window.location.href = '/home';
                } else {
                    alert('Wrong OTP');
                }
            });
        return false; // required to block normal submit since you used ajax
    }
});

$("#signup_form").validate({
    rules: {
        username: {
            minlength: 2
        },
        email: {
            email: true
        },
        password: {
            minlength: 8
        },
        "confirm-password": {
            equalTo: "password"
        }
    },
    messages: {
        username: {
            minlength: "Username should be at least 2 characters"//also taken username
        },
        email: {},
        password: {

            minlength: "Password should be at least 8 characters"
        },
        "confirm-password": {
            equalTo: "Password didn't match"
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
                if (response.success === true) {    //success
                    window.location.href = '/otp';
                } else {
                    alert('An account with this email already exists');
                }
            });
        return false; // required to block normal submit since you used ajax
    }
});


$("#signin_form").validate({
    rules: {},
    messages: {},
    submitHandler: function (form) {
        $.ajax({
            type: $(form).attr('method'),
            url: $(form).attr('action'),
            data: $(form).serialize(),
            dataType: 'json'
        })
            .done(function (response) {
                if (response.success) {    //success
                    window.location.href = '/home';
                } else {
                    alert('Wrong email or password');
                }
            });
        return false; // required to block normal submit since you used ajax
    },
});

$("#mail_forgotpass_form").validate({
    rules: {
        email: true
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
                if (response.success === true) {    //success
                    window.location.href = '/forgotpassotp';
                } else {
                    alert('No account found with this email');
                }
            });
        return false; // required to block normal submit since you used ajax
    },
});

$("#otp_forgotpass_form").validate({
    rules: {},
    messages: {
        email: {
            required: "Please enter The OTP"
        },
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
                    window.location.href = '/changepass';
                } else {
                    alert('Wrong OTP');
                }
            });
        return false; // required to block normal submit since you used ajax
    },
});

$("#change_pass_form").validate({
    rules: {
        new_password: {
            minlength: 8
        },
        confirm_new_password: {
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
    submitHandler: function (form) {
        $.ajax({
            type: $(form).attr('method'),
            url: $(form).attr('action'),
            data: $(form).serialize(),
            dataType: 'json'
        })
            .done(function (response) {
                if (response.success === 1) {    //success
                    window.location.href = '/home';
                } else {
                    alert('Could not change the password');
                }
            });
        return false; // required to block normal submit since you used ajax
    },
});


function getCoordinates(callback) {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        let crd = pos.coords;
        let lat = crd.latitude.toString();
        let lng = crd.longitude.toString();
        let coordinates = [lat, lng];
        // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates, function (location) {
            if (!getCoordinates.called) {
                getCoordinates.called = true;
                callback(location)
            }
        });
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates, callback) {
    let xhr = new XMLHttpRequest();
    let lat = coordinates[0];
    let lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.0482b87343c943c6aac1063bf8692d40&lat=" +
        lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        let location = {
            city: "Dhaka",
            country: "Bangladesh"
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            location = {
                city: response.address.city,
                country: response.address.country
            }
            callback(location);
        }
    }
}
