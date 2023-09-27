const path = require('path')
const httpMsgs = require("http-msgs");
const emailSender = require("./email");

var database = require('./database');

var {time, Time} = require('./utility');

var sentOTP, _username = "", _email = "", _password = "", _userLoggedIN = false;

function handleDefaultGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    else {
        res.redirect('/signin');
    }
}


function handleSignInGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    else {
        // res.sendFile(path.resolve('login/static', 'signin.html'));
        // res.render('signin');
        // database.loadPrayerTimes("Dhaka", 1, (results) => {
            // });
        res.render('signin', { data: req.session.prayerTime });
    }
}


function handleSignIUpGet(req, res) {
    // if (req.session.user) {
    // }
    // else {
    //   res.sendFile(__dirname + '/static/signin.html');
    // }
    res.redirect('/signin');
}

function handleHomeGet(req, res) {
    if (req.session.user) {
        res.render('dash');
    }
    else {
        res.redirect('/signin');
    }
}


function handleOTPForgotPassGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    else if (req.session.redirected) {
        res.sendFile(path.resolve('login/static', 'forgotpassotp.html'));
        delete req.session.redirected;
    }
    else {
        res.redirect('/signin');
    }
}

function handleOTPGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    else if (req.session.redirected) {
        res.sendFile(path.resolve('login/static', 'otp.html'));
        delete req.session.redirected;
    }
    else {
        res.redirect('/signin');
    }
}


function handleMailVerifyGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    else {
        res.sendFile(path.resolve('login/static', 'mailverify.html'));
    }
}

function handleChangePassGet(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    else if (req.session.redirected) {
        res.sendFile(path.resolve('login/static', 'changepass.html'));
    }
    else {
        res.redirect('/signin');
    }
}

function handleClassesGet(req, res) {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    database.loadClasses((results) => {
        res.render('classes', { data: results });
    });
}

function setPrayerTimeSession(req, res) {
    req.session.prayerTime = req.body;

    prayerTime = req.session.prayerTime;

    prayerTime.Fajr = Time.convertTo12(prayerTime.Fajr.slice(0, -6));
    prayerTime.Dhuhr = Time.convertTo12(prayerTime.Dhuhr.slice(0, -6));
    prayerTime.Asr = Time.convertTo12(prayerTime.Asr.slice(0, -6));
    prayerTime.Maghrib = Time.convertTo12(prayerTime.Maghrib.slice(0, -6));
    prayerTime.Isha = Time.convertTo12(prayerTime.Isha.slice(0, -6));

    if(req.session.prayerTime) isSuccess = 1;
    else isSuccess = 0;
    httpMsgs.sendJSON(req, res, {
        success: isSuccess
    });
}

function handlePrayerTimesGet(req, res) {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    // database.loadPrayerTimes("Dhaka", 1, (results) => {
    // });

    // console.log(req.session.prayerTime);
    res.render('PrayerTimes', { data: req.session.prayerTime });
}

function handleLogoutGet(req, res) {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect('/signin');
}

function handleProfileGet(req, res) {
    // if (req.session.user) {
    //     delete req.session.user;
    // }
    res.render('profile');
}


function handleOTPPost(req, res) {
    let otp = req.body.otp;
    if (otp == sentOTP) {
        isSuccess = 1;
        _userLoggedIN = true;
        database.insertUser(_username, _password, _email, () => {
            // _userid = results.inertedID;
        });
    }
    else {
        isSuccess = 0;
    }
    httpMsgs.sendJSON(req, res, {
        success: isSuccess,
    });
}


function handleOTPForgotPassPost(req, res) {
    let otp = req.body.otp;
    if (otp == sentOTP) {
        //From here, the user will be redirected to '/changepass' route
        req.session.redirected = true;
        isSuccess = 1;
    }
    else {
        isSuccess = 0;
    }
    httpMsgs.sendJSON(req, res, {
        success: isSuccess,
    });
}

function handleChangePassPost(req, res) {
    let new_password = req.body.new_password;

    database.updatePassword(_email, new_password, (isSuccess) => {
        httpMsgs.sendJSON(req, res, {
            success: isSuccess,
        });
    });
}

function handleNewClassPost(req, res) {
    database.insertNewClasses(req.body.topic, req.body.teacher, req.body.medium,
        req.body.address_link, req.body.class_date, req.body.class_time, (isSuccess) => {
            httpMsgs.sendJSON(req, res, {
                success: isSuccess,
            });
        });
}

function handleMailVerifyPost(req, res) {
    // Insert Login Code Here
    _email = req.body.email;

    database.verifyMail(_email, (found) => {
        //console.log(callback);
        // console.log(found);
        if (!found) {
            //From here, the user will be redirected to '/forgotpassotp' route
            req.session.redirected = true;

            emailSender.sendMailTo(_email, generatedOTP => {
                sentOTP = generatedOTP;
            });
        }
        httpMsgs.sendJSON(req, res, {
            success: !found,
        });
    });
}

function handleSignInPost(req, res) {
    // console.log(req.session.user);

    var email = req.body.email;
    var password = req.body.password;

    database.checkCredentials(email, password, (results) => {
        var isSuccess;

        if (!results.length) {
            isSuccess = 0;
        }
        else {
            isSuccess = 1;

            req.session.user = {
                email: req.body.email,
                user_id: results.user_id,
                username: results.username
            }
        }
        httpMsgs.sendJSON(req, res, {
            success: isSuccess,
        });
    });
}

function handleSignUpPost(req, res) {
    // Insert Login Code Here
    _username = req.body.username;
    _password = req.body.password;
    _email = req.body.email;

    database.verifyMail(_email, (isSuccess) => {
        //console.log(callback);
        // console.log("trying to signup");
        if (isSuccess) {
            //From here, the user will be redirected to '/otp' route
            req.session.redirected = true;
            emailSender.sendMailTo(_email, generatedOTP => {
                sentOTP = generatedOTP;
            });
        }
        httpMsgs.sendJSON(req, res, {
            success: isSuccess,
        });
    });
}

function handleEditNamePost(req, res) {
    httpMsgs.sendJSON(req, res, {
        success: 1
    });
}

function handleEditEmailPost(req, res) {
    httpMsgs.sendJSON(req, res, {
        success: 1
    });
}

function handleChangeEmailOTPlPost(req, res) {
    httpMsgs.sendJSON(req, res, {
        success: 1
    });
}

module.exports = {
    handleDefaultGet,
    handleSignInGet,
    handleSignIUpGet,
    handleHomeGet,
    handleOTPForgotPassGet,
    handleOTPGet,
    handleMailVerifyGet,
    handleChangePassGet,
    handleClassesGet,
    handleLogoutGet,
    handleOTPPost,
    handleOTPForgotPassPost,
    handleChangePassPost,
    handleNewClassPost,
    handleMailVerifyPost,
    handleSignInPost,
    handleSignUpPost,
    handlePrayerTimesGet,
    setPrayerTimeSession,
    handleProfileGet,
    handleEditNamePost,
    handleEditEmailPost,
    handleChangeEmailOTPlPost
};