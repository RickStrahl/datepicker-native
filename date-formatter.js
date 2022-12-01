
function DateFormatter() {

    // date formatting helpers
    const _monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];
    const _dayNames = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const _shortDayNames = [ 'Sun', 'Mon', 'Tues',  'Wed', 'Thur', 'Fri', 'Sat' ];
  
    this.formatDate = function formatDate(date, format = 'MM/dd/yyyy', emptyResult = '') {
        if (!date)
            return emptyResult;
        if (typeof date === "string") {
            date = new Date(date);
        }

        if (!format)
            format = "MM/dd/yyyy";

        const month = date.getMonth();
        const year = date.getFullYear();

        if (format.indexOf("yyyy") > -1)
            format = format.replace("yyyy", year.toString());
        else if (format.indexOf("yy") > -1)
            format = format.replace("yy", year.toString().substr(2, 2));

        format = format.replace("dd", date.getDate().toString().padStart(2, "0"));

        let hours = date.getHours();
        if (format.indexOf("t") > -1) {
            if (hours > 11)
                format = format.replace("t", "pm");
            else
                format = format.replace("t", "am");
        }
        if (format.indexOf("HH") > -1)
            format = format.replace("HH", hours.toString().padStart(2, "0"));
        if (format.indexOf("hh") > -1) {
            if (hours > 12) hours -= 12;
            if (hours == 0) hours = 12;
            format = format.replace("hh", hours.toString().padStart(2, "0"));
        }

        if (format.indexOf("dw") > -1)
            format = format.replace("dw", _shortDayNames[date.getDay()]);
        if (format.indexOf("DW") > -1)
            format = format.replace("dw", _dayNames[date.getDay()]);
        if (format.indexOf("mm") > -1)
            format = format.replace("mm", date.getMinutes().toString().padStart(2, "0"));
        if (format.indexOf("ss") > -1)
            format = format.replace("ss", date.getSeconds().toString().padStart(2, "0"));

        if (format.indexOf("MMMM") > -1)
            format = format.replace("MMMM", _monthNames[month]);
        else if (format.indexOf("MMM") > -1)
            format = format.replace("MMM", _monthNames[month].substr(0, 3));
        else
            format = format.replace("MM", (month + 1).toString().padStart(2, "0"));

        return format;
    }
}



// export default new DateFormatter();
