const express = require('express'); // Include ExpressJS
const path = require('path')
const app = express(); // Create an ExpressJS app

const httpMsgs = require("http-msgs");
const emailSender = require("./email");
const {getClassAppearance} = require('./utility');

const session = require("express-session");

const bodyParser = require('body-parser'); // middleware


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/assets')))
app.use(express.static(path.join(__dirname, '/assets/css')))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session(
  {
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true,
  }
));

var database = require('./database');

var sentOTP, _userid = 0, _username = "", _email = "", _password = "", _userLoggedIN = false;

// Route to Homepage
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else {
    res.redirect('/signin');
  }
});


app.get('/signin', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else {
    res.sendFile(__dirname + '/static/signin.html');
  }
});


app.get('/forgotpassotp', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else if (req.session.redirected) {
    res.sendFile(__dirname + '/static/forgotpassotp.html');
    delete req.session.redirected;
  }
  else {
    res.redirect('/signin');
  }
});


// Route to Login Page
app.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else {
    res.sendFile(__dirname + '/static/signup.html');
  }
});

app.get('/home', (req, res) => {
  if (req.session.user) {
    res.sendFile(__dirname + '/static/index.html');
  }
  else {
    res.redirect('/signin');
  }
});

app.get('/otp', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else if (req.session.redirected) {
    res.sendFile(__dirname + '/static/otp.html');
    delete req.session.redirected;
  }
  else {
    res.redirect('/signin');
  }
});


app.get('/changepass', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else if (req.session.redirected) {
    res.sendFile(__dirname + '/static/changepass.html');
  }
  else {
    res.redirect('/signin');
  }
});

app.get('/mailverify', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else {
    res.sendFile(__dirname + '/static/mailverify.html');
  }
});

app.get('/forgotpassotp', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  }
  else if (req.session.redirected) {
    res.sendFile(__dirname + '/static/forgotpassotp.html');
  }
  else {
    res.redirect('/signin');
  }
});


app.get('/classes', (req, res) => {
  database.loadClasses((results)=>{
    console.log(results);
    res.render('ClassAppearance', {data: results});
  })
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
});

app.post('/changepass', (req, res) => {
  let new_password = req.body.new_password;
  
  database.updatePassword(_email, new_password, (isSuccess) => {
    httpMsgs.sendJSON(req, res, {
      success: isSuccess,
    });
  });
});

app.post('/signup', (req, res) => {
  // Insert Login Code Here
  _username = req.body.username;
  _password = req.body.password;
  _email = req.body.email;
  
  database.verifyMail(_email, (isSuccess) => {
    //console.log(callback);
    
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
});

app.post('/mailverify', (req, res) => {
  // Insert Login Code Here
  _email = req.body.email;

  database.verifyMail(_email, (found) => {
    //console.log(callback);
    console.log(found);
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
});

app.post('/signin', (req, res) => {
  console.log(req.session.user);

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
});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));

// http://localhost:3000