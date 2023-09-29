const path = require('path')
const httpMsgs = require("http-msgs");
const emailSender = require("../server/email");

const database = require('../server/database');

const {Time} = require('../server/utility');
const {add} = require("nodemon/lib/rules");

let sentOTP;
