const nodemailer = require('nodemailer');

const otpGenerator = require('otp-generator');

otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'phoenixmailer3',
    pass: 'repr akwh oeyg jhno'
  }
});

function createOTP() 
{
    return otpGenerator.generate(6, {lowerCaseAlphabets: false, specialChars: false});
}

function createMailOptions(recieverEmail, otp)
{
    var mailOptions = {
        from: 'phoenixmailer3@gmail.com',
        to: recieverEmail,
        subject: 'Mail verification for Productive Muslim',
        
        html:
        `
        <div style="padding: 20px; background-color: rgb(255, 255, 255); ">
        <div style="color: rgb(0, 0, 0); text-align: left;">
            <h1 style="margin: 1rem 0">Verification code</h1>
            <p>Welcome to <b>Productive Muslim.</b> Please use the verification code below to
              verify your email.</p>
            <div style="text-align:left;">
                <div
                    style="border:1.5px solid teal;text-align:center;font-size:2em;color:teal;
                    border-radius:3px;display:inline-block;padding:3px 30px">
                    ${otp}
                </div>
            </div>
            <p style="padding-bottom: 0px">If you didn't request this, you can ignore this email.</p>
            <p style="padding-bottom: 16px">Thanks,<br>The Phoenix team.</p>
        </div>
      </div>
        `
     };
    return mailOptions;
}

function sendMailTo(receiverEmail, callback)
{
  otp = createOTP();
    transporter.sendMail(createMailOptions(receiverEmail, otp), function(error, info) {
        if (error) {
          console.log(error);
          callback("");
        } else {
          console.log('Email sent: ' + info.response);
          callback(otp);
        }
      });
}


module.exports = {sendMailTo};