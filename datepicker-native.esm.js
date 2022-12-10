/*
    DatePickerNative  (esm module syntax)
    ----------------
    Used to bind local dates to date controls and notify you on change
    with a native date.

    Syntax:
    initialize the control:

    DatePickerNative(el | options, intialDate, callback)

    This control sets the following values from the incoming and updated dates:

        * Callback on date changed
        * instance.Options.activeDate
        * date control element.dateValue  (added property)
        
    Constructor Parameters:
    -----------------------
    el: DOM Element or element id string
    options: Options structure of values (see below)
    initialDate: Date value to initially display. If empty current date is used
    callback: A callback function when the date is changed. Receives 3 parameters:
              function(newDate, event, instance) { }
              newDate: The new date in local time format
              event: The change event of the date picker
              DatePickerInstance: this instance. Access
    
    You can pass either an  Options structure, or provide the individual
    parameters. To identify the date picker provide a Date DOM element 
    or an ID string.

    Properties:
    -----------
    Options:  {
        element: DOM Element | string id,
        activeDate: initial or updated date used in the control
        min, max  - Min/max date to display (optional). String (2022-10-01), number of days, or date value
        userCallback: function(newDate, event, instance) { }
    }

    Functions:
    ----------
    uninitialize() 
    - removes the date selection binding from the previously
      initialized instance

    datePickerBind(element, dt)
    - allows binding of a local date to the control.

    datePickerUnbind() 

    localToGmtDate(Date)
    - converts a local date time value to a GMT date string: (2022-12-31)

    utcToLocalDate(Date)
    - converts a UTC/GMT time back to local time with the appropriate time zone

    Example:
    import DatePickerNative from "./datepicker-native.esm.js"

    // select an input date element
    var el = document.getElementById("DatePickerButtonInput");

    // assign element, startdate and callback
    // optionally create an instance you can use to access the date
    // outside of the callback
    let dpn = DatePickerNative(el, startDate, function(dt, event) {            
        // date is returned as a parameter
        showDate(dt,"ActiveDate");

        // date is set on date control as `dateValue`
        var el = document.getElementById("DatePickerButtonInput");
        showDate(el.dateValue,"ActiveDate");

        // date is available on instance
        showDate(dpn.Options.activeDate,"ActiveDate");
    });
    showDate(startDate,"ActiveDate");
*/
function DatePickerNative(el, initialDate, callback) {
    var _this = this;
    var opt = null;
    
    if (typeof el == "string")
    {
        if (el === "uninitialize") {
            uninitialize();
            return;
        }
        el = document.getElementById(el);
        if (!el) {
            throw new Error("Invalid element provided. Provide either an DOM Element or an id string to an element.");            
        }
    }
    
    if (el.element) {        
        opt = el;  // assume options object was passed
    }
    else {
        opt =  {
            element: el,
            userCallback: callback,
            activeDate: initialDate,
            min: "",
            max: ""        
        };        
    }
    this.options = opt;

    function intialize(opt) {
        if(typeof opt.activeDate != 'object')
            opt.activeDate = new Date();

        if (opt.element) {
            opt.element.addEventListener("change",datePickerUnbind);     
            datePickerBind(opt.element,opt.activeDate, opt.userCallback);
        }
    }    

    function uninitialize(){
        opt.element.removeEventListener("change",datePickerUnbind);        
    }
    
    function datePickerBind(element, dt) {        
        var newDate = localToGmtDate(dt);
        
        opt.element.dateValue = dt;   // original date        
        opt.element.value = newDate;
        
        opt.element.min = normalizeMin(opt.min);
        opt.element.max = normalizeMax(opt.max);
    }
    
    function datePickerUnbind(event) {
        var dt = event.target.valueAsDate;
        let newDate =  utcToLocalDate(dt);
        

        opt.element.dateValue = newDate;
        opt.activeDate = newDate;

        if(opt.userCallback){
            opt.userCallback(newDate, event, _this);
        }
    }

    function localToGmtDate(localDate) {
        return localDate && new Date(localDate.getTime()-(localDate.getTimezoneOffset()*60*1000)).toISOString().split('T')[0];        
    }
    
    function utcToLocalDate(utcDate) {
        return new Date(utcDate.getTime()+(utcDate.getTimezoneOffset()*60*1000));        
    }

    function normalizeMin(minVal) {    
        if (typeof minVal === "string")
            return minVal;


        if (typeof minVal === "number") {
            let dt = new Date();
            dt = new Date(dt.setDate(dt.getDate() - minVal));
            minVal = dt;
        }

        return localToGmtDate(minVal);
    }

    function normalizeMax(maxVal) {
        
        if (typeof maxVal === "string") {            
            return maxVal;
        }

        let dt = new Date();
        if (typeof maxVal === "number") {
           dt = new Date();
           dt = new Date(dt.setDate(dt.getDate() + maxVal));
           maxVal = dt;
        }

        return localToGmtDate(maxVal);
    }

    intialize(opt);                
    return _this;
}

export default DatePickerNative;