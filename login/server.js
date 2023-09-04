const express = require('express'); // Include ExpressJS
const path = require('path')
const app = express(); // Create an ExpressJS app

const httpMsgs = require("http-msgs");

const bodyParser = require('body-parser'); // middleware
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static("assets"));
app.use(express.static(path.join(__dirname, '/assets')))
app.use(express.static(path.join(__dirname, '/assets/css')))

var database = require('./database');

// Route to Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
    //res.sendFile(__dirname + '/client.js');
  });

// Route to Login Page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/signup.html');
  });

app.post('/login', (req, res) => {
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  database.insertUser(username, password, email,(callback)=>{
    //console.log(callback);
    
    var x;
    if(callback==1)x='success'
    else x='failure'

    httpMsgs.sendJSON(req,res,{
      success: x
    });
  });
  
});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));