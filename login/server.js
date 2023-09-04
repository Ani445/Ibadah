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

var sentOTP, _username = "", _email = "",  _password = "", _userLoggedIN = false;

// Route to Homepage
app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/static/index.html');
  res.redirect('/signup');
  //res.sendFile(__dirname + '/client.js');
});

// Route to Login Page
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/static/signup.html');
  if(_userLoggedIN) {
    res.redirect('/home');
  }
});

app.get('/home', (req, res) => {
  if(!_userLoggedIN) {
    res.redirect('/signup');
  }
  else {
    res.sendFile(__dirname + '/static/index.html');
  }
});

app.get('/otp', (req, res) => {
  if(!_userLoggedIN && _username === "") {
    res.redirect('/signup');
  }
  else if(!_userLoggedIN) {
    res.sendFile(__dirname + '/static/otp.html');
  }
  else {
    res.redirect('/home');
  }
});

app.post('/otp', (req, res) => {
  let otp = req.body.otp;
  if(otp == sentOTP) {
    isSuccess = 1;
    _userLoggedIN = true;
    database.insertUser(_username, _password, _email);
  }
  else {
    isSuccess = 0;
  }
  httpMsgs.sendJSON(req, res, {
    success: isSuccess,
  });
});

app.post('/signup', (req, res) => {
  // Insert Login Code Here
  _username = req.body.username;
  _password = req.body.password;
  _email = req.body.email;

  database.verifyMail(_username, (isSuccess) => {
    //console.log(callback);

    if(isSuccess) {
      emailSender.sendMailTo(_email, generatedOTP => {
        sentOTP = generatedOTP;
      });
    }
    httpMsgs.sendJSON(req, res, {
      success: isSuccess,
    });
  });

});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));