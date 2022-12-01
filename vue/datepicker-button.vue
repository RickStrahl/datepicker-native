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
