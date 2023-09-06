const express = require('express'); // Include ExpressJS
const path = require('path')
const app = express(); // Create an ExpressJS app

const httpMsgs = require("http-msgs");
const emailSender = require("./email");

const bodyParser = require('body-parser'); // middleware
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static("assets"));
app.use(express.static(path.join(__dirname, '/assets')))
app.use(express.static(path.join(__dirname, '/assets/css')))

var database = require('./database');

var sentOTP, _userid = 0, _username = "", _email = "", _password = "", _userLoggedIN = false;

// Route to Homepage
app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/static/index.html');
  res.redirect('/signin');
  //res.sendFile(__dirname + '/client.js');
});


app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/static/signin.html');
});


app.get('/forgotpassotp', (req, res) => {
  res.sendFile(__dirname + '/static/forgotpassotp.html');
});


app.post('/signin', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  database.checkCredentials(email, password, (results) => {
    //console.log(callback);
    var isSuccess;

    if (!results.length) {
      isSuccess = 0;
    }
    else {
      isSuccess = 1;
      _userid = results.username;
      _username = results.username;
      _email = results.email;
    }
    httpMsgs.sendJSON(req, res, {
      success: isSuccess,
    });
  });
});


// Route to Login Page
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/static/signup.html');
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/otp', (req, res) => {
  res.sendFile(__dirname + '/static/otp.html');
});

app.post('/otp', (req, res) => {
  let otp = req.body.otp;
  if (otp == sentOTP) {
    isSuccess = 1;
    _userLoggedIN = true;
    database.insertUser(_username, _password, _email, (results) => {
      // _userid = results.inertedID;
    });
  }
  else {
    isSuccess = 0;
  }
  httpMsgs.sendJSON(req, res, {
    success: isSuccess,
  });
});

app.post('/forgotpassotp', (req, res) => {
  let otp = req.body.otp;
  if (otp == sentOTP) {
    isSuccess = 1;
  }
  else {
    isSuccess = 0;
  }
  httpMsgs.sendJSON(req, res, {
    success: isSuccess,
  });
});


app.post('/changepass', (req, res) => {
  let new_password = req.body.new_password;

  database.updatePassword(_userid, new_password, (isSuccess) => {
    httpMsgs.sendJSON(req, res, {
      success: isSuccess,
    });
  });
});

app.get('/changepass', (req, res) => {
  res.sendFile(__dirname + '/static/changepass.html');
});

app.get('/mailverify', (req, res) => {
  res.sendFile(__dirname + '/static/mailverify.html');
});

app.get('/forgotpassotp', (req, res) => {
  res.sendFile(__dirname + '/static/forgotpassotp.html');
});

app.post('/signup', (req, res) => {
  // Insert Login Code Here
  _username = req.body.username;
  _password = req.body.password;
  _email = req.body.email;

  database.verifyMail(_email, (x, isSuccess) => {
    //console.log(callback);

    if (isSuccess) {
      emailSender.sendMailTo(_email, generatedOTP => {
        sentOTP = generatedOTP;
      });
    }
    httpMsgs.sendJSON(req, res, {
      success: isSuccess,
    });
  });
});


app.post('/mailverify', (req, res) => {
  // Insert Login Code Here
  _email = req.body.email;

  database.verifyMail(_email, (user_id, found) => {
    //console.log(callback);
    if (found) {
      _userid = user_id;
      console.log(_userid);
      emailSender.sendMailTo(_email, generatedOTP => {
        sentOTP = generatedOTP;
      });
    }
    httpMsgs.sendJSON(req, res, {
      success: found,
    });
  });
});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));