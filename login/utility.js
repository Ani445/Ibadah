const fs = require('fs');

function getClassAppearance()
{
    var data = fs.readFileSync('./ClassAppearance.html', { encoding: 'utf8', flag: 'r' });

    return data;
}

module.exports = {getClassAppearance};