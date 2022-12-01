# Native JavaScript Date Picker

This repo holds a few components that make it easier to use the native date time pickers within applications.

* Native DatePicker local time translation
* Button only date lookups 
* Vue Component for Button Lookups

## Button Only Lookups
The genesis of this example was my need to add a date picker to an application that is based on a button, rather than on a full `<input type='date' />` control. As you know the input control provides a date picker popup but it doesn't directly support just popping up the date picker without the input control. 

To facility this functionality this library provides a `DatePickerNative()` class that you can use from raw JavaScript, or the `datepicker-button` Vue component that lets you quickly add this functionality to your own apps. 

![](images/DatePickerButton.png)

## Local Date Fix ups
The date picker input control by default uses UTC dates, so the date picker often displays a value that is not representative of the user's local time. This gives unexpected results. To fix this the simple `DatePickerNative` component automatically fixes up the date both on binding and unbinding values. The control provides the updated value via notification with a callback (in the plain JS version) or an emitted event (in the Vue version).

## How it works
To create a button only involves a few steps:

* Add the button HTML
* Add `DatePickerNative.js` library
* Add `DatePickerNative.css` styles (small so you can inline these)


We'll start with the HTML:

```html
<button id="DatePicker" class="datepicker-native btn btn-secondary btn-sm">
    <i class="far fa-calendar-alt"></i>
    <input type="date" class="datepicker-native-input" />
</button>
```

I'm using **font-awesome** for the icon here, but you can use whatever you like for the content for the button - text, image, icon, it doesn't matter. The `btn` styles are **bootstrap** and likewise, you can use whatever you want or no styling for the button.

The important, required pieces are the two styles:  

* **datepicker-native** on the button
* **datepicker-native-input** on the embedded `<input type="date" />` control

The trick to making the button work without the input control is to effectively making it invisible, but still active and overlaying the button content over it. The key to this is the CSS:

```css
.datepicker-native {
    position: relative;
}
.datepicker-native-input {
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    opacity: 0;
}
.datepicker-native-input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
}
```

The button is marked as `position:relative` width the input made full width and height of the button, but effectively invisible. The `opacity` is 0 so the control is not visible, but because the `position: absolute` it sits ontop of the button content and is still responsive. So now when you click the date control is activated.

One more important piece to this is the `.datepicker-native-input::-webkit-calendar-picker-indicator` style which effectively makes the entire date control clickable instead of just the calendar button of the native control.

The script operation then activates the initial date binding which adjusts the date appropriately and allows any changes to fire a callback:

```js
var startDate = new Date(2022,10,10);

var el = document.getElementById("DatePicker");
 
// *** Create the component and handle the callback
DatePickerNative(el, startDate, function(dt, event) {
    // updated date is returned
    showDate(dt,"ActiveDate");
});
showDate(startDate,"ActiveDate");
```

## Also works for plain Date Controls
The same handling also works for plain DatePicker controls which is useful as it handles the automatic date UTC to local date conversions.

For full input control the code is the same:

```js
 var elInput = document.getElementById("DatePickerInput");
 DatePickerNative(elInput, startDate, function(dt, event) {
    showDate(dt, "ActiveDateInput");
 });
 showDate(startDate,"ActiveDateInput");
```

The behavior here is the default dropdown behavior, but with the benefit of the adjusted local date.

![](images/DatePickerInput.png)

The HTML for this use case is just the plain input control:

```html
<input id="DatePickerInput" type="date" class="form-control" />
```

and the custom CSS is not required as that only pertains to the button.

## Plain JavaScript
Because this component uses plain, old JavaScript it'll work in any environment which is the point of using the native control interface. 

## Vue Component
For good measure I ran into all of this originally within a Vue application and I initially build a Vue component for a drop-in `data-button` component only later backfitting the plain JS component. 

The Vue version is a bit less generic as it uses bootstrap and font-awesome in the template, but you might find this useful anyway as you can customize the layout for your own application.

Here's the Vue Component:

```html
<template>
    <button v-bind:class="buttonClass  + ' ' + addButtonClass" v-bind:title="title">
        <i v-bind:class="buttonIconClass"></i>

        <input type="date" class="datepicker-button-input"
               :value="datePickerBind(dateValue)"
               @input="datePickerUnbind($event.target.valueAsDate,dateValue)"
        />
    </button>
</template>

<script>
/*
Native Date Picker Button
-------------------------

This is a native date picker button.

properties:
title - title text for the button
dateValue - initial date (note this value is not updated)
dateId - optional unique ID for this date so you can differentiate for the update event
buttonClass - full class string for the button (default: btn btn-secondary btn-sm datepicker-button)
addButtonClass - adds these classes to the default class
buttonStyle - additional style overrides for the button
buttonIconClass - full class for icon (default: fad fa-calendar-alt fa-fw)

emits:
update:dateValue
- fired when the date is changed.
 */
export default {
    name:"DatePickerButton",

    props: {
        title: {type: String, default: "Select a date"},
        dateValue: {type: Date, default: new Date() },
        dateId: { type: String, default: new Date().getTime().toString() },

        buttonClass: {type: String, default: "btn btn-secondary btn-sm datepicker-button" },
        addButtonClass: {type: String, default: "" },
        buttonStyle: {type: String, default: "" },
        buttonIconClass: { type: String, default: "fad fa-calendar-alt fa-fw" }
    },
    methods: {
        datePickerBind(dt) {
            return dt && new Date(dt.getTime()-(dt.getTimezoneOffset()*60*1000)).toISOString().split('T')[0];
        },

        datePickerUnbind(dt) {
            let newDate =  new Date(dt.getTime()+(dt.getTimezoneOffset()*60*1000));
            this.$emit("update:dateValue",newDate, this.dateId);
        }
    },
}
</script>

<style scoped>
.datepicker-button {
    position: relative;
}
.datepicker-button-input {
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    opacity: 0;
}
.datepicker-button-input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
```

The difference here is that hte component raises an event `update:dateValue` which the host can listen to.

Using the component then looks like this:

```html
<date-picker-button
    v-bind:date-value="activeDate"
    v-on:update:dateValue="dateUpdated($event)"
>
</date-picker-button>
```

to handle the event and update the value:


```js
export default {
    components: {DatePickerButton},
    ...
    data() {
        vm = this;  // hang on to proxy reference
        return {
            activeDate: new Date()
        };
    },
    methods: {
        dateUpdated(newDate){
            if (vm.activeDate === newDate) return;

            vm.activeDate = newDate;
            vm.global.lastAssignedTaskSearchDate = newDate;
            vm.getJobTasks();
        },
    }
```

You could also remove the code method and do the following instead:

```html
v-on:update:dateValue="activeDate = $event"
```

