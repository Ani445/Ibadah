class Time { // store time in 24 hr format
    // constructor() {
    //     this.hour = 0;
    //     this.minute = 0;
    //     this.seccond = 0;
    // }
    // constructor(hour, minute, second = 0) {
    //     this.hour = hour;
    //     this.minute = minute;
    //     this.seccond = second;
    // }
    /**
     * Give the time in "HH:MM:SS" format
     * @param {String} str 
     */
    // constructor(str) {
    //     split = str.split(':');
    //     this.hour = +split[0] != NaN ? +split[0] : 0;
    //     this.minute = +split[1] != NaN ? +split[1] : 0;
    //     if(split.length > 2) this.seccond = +split[2] != NaN ? +split[2] : 0;
    // }

    // getTime24() {
    //     return `${this.hour}:${this.minute}`;
    // }

    // getTime12() {
    //     var ampm;
    //     if(this.hour == 12) ampm = "PM";
    //     else if(this.hour > 12) {
    //         ampm = "PM";
    //         this.hour %= 12;
    //     }
    //     else ampm = "AM";

    //     return `${this.hour}:${this.minute} ${ampm}`;
    // }
    
    static convertTo12(str) {
        var split = str.split(':');
        var hour = isNaN(+split[0]) ? 0 : +split[0];
        var minute = isNaN(+split[1]) ? 0 : +split[1];
        var seccond;
        if(split.length > 2) seccond = isNaN(+split[2]) ? 0 : +split[2];

        var ampm;
        if(hour == 12) ampm = "PM";
        else if(hour > 12) {
            ampm = "PM";
            hour %= 12;
            if(hour == 0) ampm = "AM";
        }
        else ampm = "AM";

        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
    }
}

module.exports = {Time};