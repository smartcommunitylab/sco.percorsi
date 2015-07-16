// This will be the REST calling JS api
// npm install jquery

// Need a simple test whether we are running under Node.js, so that we can
// load code differently when running under phonegap
// If true we are running within Node.js, so
var inNode = false;
if (typeof window === 'undefined') {

    console.log("Assuming we are running in Node.js test environment");
    inNode = true;

} else {
    console.log("Assuming we are running in a browser/Phonegap application");
    inNode = false;
}


if (inNode) {

    // We need to create a DOM outside of jquery, now
    var jsdom = require("jsdom");
    var jq = require("jquery")(jsdom.jsdom().createWindow());
    var https = require('https');

    var request = require('request'),
        sys = require('sys');
} else {
    // Link to the jquery library, should be loaded directly by the
    // toplevel index.html file
    var jq = jQuery;
}

//Global to store initial timestamps for calculating durations
var lasttime;

// Set up a global conection structure
var Restlogging = {

    // Defaults
    connection: {
        server: "https://iescities.com:8443",
        basedir: "/IESCities/api/log/app",
        appname: "DefaultAppName",
        sessionid: 0
    },

    genRandomID: function () {

        var MAXSESSIONID = 100000000;
        return (Math.floor(Math.random() * MAXSESSIONID));
    },


    init: function (server) {

        var sess = 0;


        //Generate and store a persistent device ID that is anonymous
        if (typeof (Storage) !== "undefined") {
            if (localStorage.deviceID) {
                sess = localStorage.deviceID;
                console.log("Re-using device ID: " + sess);
            } else {
                // Create a random ID
                // --negative to differentiate sessionID and device IDs
                sess = -1 * this.genRandomID();
                localStorage.deviceID = sess;
                console.log("Creating device ID: " + sess);
            }
        } else { //Device does not support local storage

            console.log("Sorry, your device does not support local storage for Device ID");
            // For now use a random session ID
            sess = genRandomID();
        }

        //Try to grab the app name from the top level document
        //Assume that it lives in the app div in the first h1 block
        try {
            var apptxt = document.getElementsByClassName('app');
            var header = apptxt[0].getElementsByTagName("h1");
            var appname = header[0].innerHTML;
        } catch (err) {
            //Do something if this is not found...
            appname = "UndefinedApplicationName";
        }

        console.log("Initialising app '" + appname + " (session id " + sess + "') connecting to server " + server);

        // Store the values in the main object
        this.connection.appname = appname;
        this.connection.server = server;
        this.connection.sessionid = sess;
        this.bindEvents();

        // STEFANOS: added this here, because for now events are not being handled in this app..
        // TIM: need to discuss what is going wrong here.
        console.log("Logger initialized!");
        Restlogging.appStart();

    },

    // Bind common events
    // Note that we handle switching away from the app as app close
    // and resuming as app restart
    // This should allow us to monitor screen time of the app
    bindEvents: function () {

        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onStop, false);
        document.addEventListener('backbutton', this.onStop, false);
        document.addEventListener('resume', this.onStart, false);
        document.addEventListener('menubutton', this.onStop, false);
    },

    onDeviceReady: function () {

        //Restlogging.testAppAPI();
        Restlogging.appStart();
    },

    // Not technically closing the app, but we  need to register when the
    // user switches away from it.
    onStop: function () {

        Restlogging.appStop();
    },

    onStart: function () {

        Restlogging.appStart();
    },

    // Note we do not currently use posting for the logging API
    postURL: function (url, postdata) {

        console.log("Testing post mechanism <" + url + ">");
        // Post and print drop the return result

        if (inNode) {

            request.post(url); //.form({key:'value'})
        } else {
            // Add instrumentation to time the call end to end
            var starttime = (new Date).getTime();

            jq.ajax({
                dataType: "text",
                type: "POST",
                url: url,
                crossDomain: true,
                data: postdata,
                cache: false,
                async: true,
                //xhrFields: {
                //  withCredentials: true
                //},
                success: function (data) {

                    var timed = (new Date).getTime() - starttime;
                    //console.log("success: " + data);
                    console.log("Call completed in " + timed + "ms");

                },
                error: function (jqXHR, textStatus, errorThrown) {

                    console.log("Mistake: " + errorThrown);
                }
            });
        }
    },

    restPost: function (url) {

        this.postURL(this.connection.server + this.connection.basedir + url);
    },

    // This does app level logging
    // Note we do not restrict event types here for now, this is done at server side
    appLog: function (type, message) {

        console.log("IES Logger will now log an event of type \"" + type + "\" with message \"" + message + "\".");

        //Get the current time
        time = (new Date).getTime() / 1000 //Keep as seconds, with millisecond resolution


        this.restPost("/event/" + time + "/" + this.connection.appname + "/" + this.connection.sessionid + "/" + type + "/" + message, "logged");
    },

    // Log a performance statistic for event type and custom message
    perfLog: function (type, message, duration) {

        //Get the current time
        time = (new Date).getTime() / 1000 //Keep as seconds, with millisecond resolution

        this.restPost("/perf/" + time + "/" + this.connection.appname + "/" + this.connection.sessionid + "/" + type + "/" + duration + "/" + message, "logged");
    },


    appCustom: function (message) {

        console.log("AppCustom");
        this.appLog("AppCustom", message);
    },

    appStart: function () {

        lasttime = (new Date).getTime();
        console.log("AppStart");
        this.appLog("AppStart", "Phone event");
    },

    appStop: function () {

        var active = (new Date).getTime() - lasttime;

        console.log("Application active for " + active);
        this.appLog("AppStop", "Phone event");
        //Also create app usage time log
        this.perfLog("AppStop", "App active for", active);
    },

    appTime: function (func, testname) {

        console.log(func);

        //Test the overhead of spawning a log
        var loops = 10
        var starttime = (new Date).getTime();

        for (var i = 0; i < loops; i++) {

            func.call(this); // This calls function in the correct context
        }

        var endtime = (new Date).getTime() - starttime;

        var div = document.body.children[1];
        var span = document.createElement('span')

        span.innerHTML = "<p> Time for test [" + testname + "] is " + endtime / loops + " ms";

        // Add the performance log to the database
        this.perfLog("AppCustom", testname, Math.floor(endtime / loops));

        div.appendChild(span)
    },


    appTest: function () {

        this.appTime(this.appStart, "single app log");
        this.appTime(this.countLogApp, "get number of logged calls");
    }

};


if (inNode) {

    //Export the interface
    exports.Restlogging = Restlogging;
}
