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

var sentOTP, _username = "", _email = "", _password = "", _userLoggedIN = false;

// Route to Homepage
app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/static/index.html');
  res.redirect('/signin');
  //res.sendFile(__dirname + '/client.js');
});


app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/static/signin.html');
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
    database.insertUser(_username, _password, _email);
  }
  else {
    isSuccess = 0;
  }
  httpMsgs.sendJSON(req, res, {
    success: isSuccess,
  });
});

app.get('/mailverify', (req, res) => {
  res.sendFile(__dirname + '/static/mailverify.html');
});

app.post('/signup', (req, res) => {
  // Insert Login Code Here
  _username = req.body.username;
  _password = req.body.password;
  _email = req.body.email;

  database.verifyMail(_username, (isSuccess) => {
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

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));