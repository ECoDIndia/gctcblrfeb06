/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
Node.js application for connecting the Intel Edison Arduino to IBM Bluemix
using Quickstart.
Sends data from an analog sensor on analog pin zero (A0).
*/

//Change the following to your Edison's MAC address
var MAC = '784b87a80178';

var ibmiotf    = require('ibmiotf');

var config = {
    "org" : "3wqzso",
    "id" : "784b87a801ee",
    "type" : "edison",
    "auth-method" : "token",
    "auth-token" : "qwertyu123"
};
 
var deviceClient = new ibmiotf.IotfDevice(config);

deviceClient.connect();

deviceClient.on('connect', function () {
  setInterval(function(){
    deviceClient.publish("status","json", '{"d":{"temp":' + getTemp() + '}}');//Payload is JSON
  }, 2000);//Keeps publishing every 2000 milliseconds.
});

//Connect to an analog sensor on Edison Arduino pin A0.
//Uses mraa included with Edison image.  More info at: 
//http://iotdk.intel.com/docs/master/mraa/index.html
//Edison Arduino returns drifting values if you have no sensor; you can see
//the "data" on Bluemix if you have no sensor connected on pin A0.
// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);
console.log(temp.name());

var getTemp = function() {
  var celsius = temp.value();
  console.log("Temp is "+celsius);
  return celsius.toFixed(4);

};

//LCD screen
var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
display.setCursor(1, 1);

var groveSensor = require('jsupm_grove');

// Create the Grove LED object using GPIO pin 2
var led = new groveSensor.GroveLed(2);

// Print the name
console.log(led.name());

deviceClient.on('command', function(commandName,format,payload,topic) {
    
    if(commandName === "alert") {
        console.log("Alert!!! : "+payload);
        display.clear();
        display.setCursor(0,0);
        display.write(payload+'');
        led.on();
        setTimeout(function() {
            led.off();
        }, );
    } else {
        console.log("Not supported command :"+commandName);
    }
});


