dependencies = [
    "axios",
    "body-parser",
    "ejs",
    "express",
    "express-session",
    "http-msgs",
    "jquery",
    "mysql",
    "nodemailer",
    "nodemon",
    "otp-generator"
]

const {exec} = require('child_process');

function installDependencies() {
    console.log('Installing dependencies...');
    dependencies.forEach(dependency => {
        exec(`npm install ${dependency}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing ${dependency}: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error installing ${dependency}: ${stderr}`);
                return;
            }
            console.log(`Installed ${dependency}: ${stdout}`);
        });
    });
}

// Call the function to install dependencies
installDependencies();
