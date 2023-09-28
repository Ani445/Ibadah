const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app

const path = require('path')
const {time, Time} = require('./utility')
const bodyParser = require('body-parser'); // middleware

const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve('login/assets/client')));
app.use(express.static(path.resolve('login/assets/css')));

app.set('views', path.resolve('login/views'));
app.set('view engine', 'ejs');

app.use(session(
  {
    secret: "kaanekaanebolishuno",
    resave: true,
    saveUninitialized: true,
  }
));


const { handleDefaultGet, handleSignInGet, handleSignIUpGet, handleHomeGet,
  handleOTPForgotPassGet, handleOTPGet, handleMailVerifyGet,
  handleChangePassGet, handleClassesGet, handleLogoutGet, handleOTPPost, handleOTPForgotPassPost,
  handleChangePassPost, handleNewClassPost, handlePrayerTimesGet, handleMailVerifyPost, handleSignInPost,
  handleSignUpPost, setPrayerTimeSession, handleProfileGet, handleEditNamePost, handleEditEmailPost,
  handleChangeEmailOTPlPost, sendUserName} = require('./router');
const http = require("http");


// Route to Homepage
app.get('/', (req, res) => {
  handleDefaultGet(req, res);
});


app.get('/signin', (req, res) => {
  handleSignInGet(req, res);
});


app.get('/forgotpassotp', (req, res) => {
  handleOTPForgotPassGet(req, res);
});


// Route to Login Page
app.get('/signup', (req, res) => {
  handleSignIUpGet(req, res);
});

app.get('/home', (req, res) => {
  handleHomeGet(req, res);
});

app.get('/otp', (req, res) => {
  handleOTPGet(req, res);
});


app.get('/changepass', (req, res) => {
  handleChangePassGet(req, res);
});

app.get('/mailverify', (req, res) => {
  handleMailVerifyGet(req, res);
});


app.get('/classes', (req, res) => {
  handleClassesGet(req, res);
});

app.get('/profile', (req, res) => {
  handleProfileGet(req, res);
});

app.get('/logout', (req, res) => {
  handleLogoutGet(req, res);
});

app.get('/prayer-times', (req, res) => {
  handlePrayerTimesGet(req, res);
});

app.post('/otp', (req, res) => {
  handleOTPPost(req, res);
});

app.post('/forgotpassotp', (req, res) => {
  handleOTPForgotPassPost(req, res);
});

app.post('/changepass', (req, res) => {
  handleChangePassPost(req, res);
});


app.post('/new-class', (req, res) => {
  handleNewClassPost(req, res);
});


app.post('/signup', (req, res) => {
  handleSignUpPost(req, res);
});

app.post('/mailverify', (req, res) => {
  handleMailVerifyPost(req, res);
});

app.post('/signin', (req, res) => {
  handleSignInPost(req, res);
});

app.post('/setPrayerTimeSession',(req,res)=>{
  setPrayerTimeSession(req,res);
});

app.post('/edit-name',(req,res)=>{
  handleEditNamePost(req,res);
});

app.post('/edit-email',(req,res)=>{
  handleEditEmailPost(req,res);
});

app.post('/change-email-otp',(req,res)=>{
  handleChangeEmailOTPlPost(req,res);
});

app.post('/get-username', (req, res) => {
  sendUserName(req,res);
});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));

// http://localhost:3000
