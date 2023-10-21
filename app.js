const express = require('express'); // Include Express.js
const app = express(); // Create an Express.js app

const path = require('path')
const bodyParser = require('body-parser'); // middleware

const session = require("express-session");
app.use(session({
    secret: "kaanekaanebolishuno", resave: true, saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const classesRoutes = require('./routes/classes');
const prayerTimeRoutes = require('./routes/prayer-times');
const sidebarRoutes = require('./routes/sidebar');
const calendarEventRoutes = require('./routes/my-calendar');

app.use('/', loginRoutes);
app.use('/', registerRoutes);
app.use('/', userRoutes);
app.use('/', profileRoutes);
app.use('/', classesRoutes);
app.use('/', prayerTimeRoutes);
app.use('/', sidebarRoutes);
app.use('/', calendarEventRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));

// http://localhost:3000
