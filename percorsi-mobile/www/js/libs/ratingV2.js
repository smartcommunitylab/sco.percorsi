/*
 * Current version: 11/06/2015
 * Author: TOSHIBA
 * Contact: stefanos.vatsikas@toshiba-trel.com
 *
 * This file handles the user rating/feedback functionality of an IES Cities app.
 * It requires the presence of jquery, jquery-impromptu.js and rating.css files.
 *
 * To integrate in your code, include the relevant js files and then call the
 * function startRatingSurvey(). Also make sure the questions.js file is present.
 *
 * The popup window is currently triggered by the number of times the app has been launched.
 * This functionality is controlled by the launcuCounter() function and can be easily altered
 * to support a different policy.
 *
 * */

var htmlQuestion;
var surveyStates = new Array();
var surveyComplete = false;
var manualTrigger = false;
var cityName = "Rovereto";
var appName = "roveretoPercorsi";
var ratingURL = "/IESCities/api/log/rating/trackedresponse/";
var surveyTitle = "How do you like this app?";

/* Load the JSON file that contains the in-app questions */
function loadJSONfile() {
    jQuery.getJSON("data/questionsV2.json", function (data) {
        createHTMLquestions(data);
    });
}

/* Parse the JSON question data and create the HTML-formatted questions */
function createHTMLquestions(data) {

    cityName = data.questionnaire.city;
    appName = data.questionnaire.app;
    surveyTitle = data.questionnaire.surveytitle;
    var question1 = data.questionnaire.question1;
    var question2 = data.questionnaire.question2;
    var question3 = data.questionnaire.question3;
    var question4 = data.questionnaire.question4;
    var question5 = data.questionnaire.question5;
    var question6 = data.questionnaire.question6;
    var question7 = data.questionnaire.question7;
    var question8 = data.questionnaire.question8;


    // http://www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
    var strVar = "";
    strVar += "    <div class=\"RatingContainer\">";
    strVar += "        <p class=\"starRatingPara\">";
    strVar += question1;
    strVar += "        <span class=\"starRating\">";
    strVar += "        <input id=\"rating5\" type=\"radio\" name=\"rating1\" value=\"5\">";
    strVar += "        <label for=\"rating5\">5<\/label>";
    strVar += "        <input id=\"rating4\" type=\"radio\" name=\"rating1\" value=\"4\">";
    strVar += "        <label for=\"rating4\">4<\/label>";
    strVar += "        <input id=\"rating3\" type=\"radio\" name=\"rating1\" value=\"3\">";
    strVar += "        <label for=\"rating3\">3<\/label>";
    strVar += "        <input id=\"rating2\" type=\"radio\" name=\"rating1\" value=\"2\">";
    strVar += "        <label for=\"rating2\">2<\/label>";
    strVar += "        <input id=\"rating1\" type=\"radio\" name=\"rating1\" value=\"1\">";
    strVar += "        <label for=\"rating1\">1<\/label>";
    strVar += "        <\/span>";
    strVar += "        <\/p>";
    strVar += "        <p class=\"starRatingPara\">";
    strVar += question2;
    strVar += "        <span class=\"starRating\">";
    strVar += "        <input id=\"rating5a\" type=\"radio\" name=\"rating2\" value=\"5\">";
    strVar += "        <label for=\"rating5a\">5<\/label>";
    strVar += "        <input id=\"rating4a\" type=\"radio\" name=\"rating2\" value=\"4\">";
    strVar += "        <label for=\"rating4a\">4<\/label>";
    strVar += "        <input id=\"rating3a\" type=\"radio\" name=\"rating2\" value=\"3\">";
    strVar += "        <label for=\"rating3a\">3<\/label>";
    strVar += "        <input id=\"rating2a\" type=\"radio\" name=\"rating2\" value=\"2\">"
    strVar += "        <label for=\"rating2a\">2<\/label>";
    strVar += "        <input id=\"rating1a\" type=\"radio\" name=\"rating2\" value=\"1\">";
    strVar += "        <label for=\"rating1a\">1<\/label>";
    strVar += "        <\/span>";
    strVar += "        <\/p>";
    strVar += "        <p class=\"starRatingPara\">";
    strVar += question3;
    strVar += "        <span class=\"starRating\">";
    strVar += "        <input id=\"rating5b\" type=\"radio\" name=\"rating3\" value=\"5\">";
    strVar += "        <label for=\"rating5b\">5<\/label>";
    strVar += "        <input id=\"rating4b\" type=\"radio\" name=\"rating3\" value=\"4\">";
    strVar += "        <label for=\"rating4b\">4<\/label>";
    strVar += "        <input id=\"rating3b\" type=\"radio\" name=\"rating3\" value=\"3\">";
    strVar += "        <label for=\"rating3b\">3<\/label>";
    strVar += "        <input id=\"rating2b\" type=\"radio\" name=\"rating3\" value=\"2\">";
    strVar += "        <label for=\"rating2b\">2<\/label>";
    strVar += "        <input id=\"rating1b\" type=\"radio\" name=\"rating3\" value=\"1\">";
    strVar += "        <label for=\"rating1b\">1<\/label>";
    strVar += "        <\/span>";
    strVar += "        <\/p>";
    strVar += "        <p class=\"starRatingPara\">";
    strVar += question4;
    strVar += "        <span class=\"starRating\">";
    strVar += "        <input id=\"rating5c\" type=\"radio\" name=\"rating4\" value=\"5\">";
    strVar += "        <label for=\"rating5c\">5<\/label>";
    strVar += "        <input id=\"rating4c\" type=\"radio\" name=\"rating4\" value=\"4\">";
    strVar += "        <label for=\"rating4c\">4<\/label>";
    strVar += "        <input id=\"rating3c\" type=\"radio\" name=\"rating4\" value=\"3\">";
    strVar += "        <label for=\"rating3c\">3<\/label>";
    strVar += "        <input id=\"rating2c\" type=\"radio\" name=\"rating4\" value=\"2\">";
    strVar += "        <label for=\"rating2c\">2<\/label>";
    strVar += "        <input id=\"rating1c\" type=\"radio\" name=\"rating4\" value=\"1\">";
    strVar += "        <label for=\"rating1c\">1<\/label>";
    strVar += "        <\/span>";
    strVar += "        <\/p>";
    strVar += "        <p class=\"starRatingPara\">";
    strVar += question5;
    strVar += "        <span class=\"starRating\">";
    strVar += "        <input id=\"rating5d\" type=\"radio\" name=\"rating5\" value=\"5\">";
    strVar += "        <label for=\"rating5d\">5<\/label>";
    strVar += "        <input id=\"rating4d\" type=\"radio\" name=\"rating5\" value=\"4\">";
    strVar += "        <label for=\"rating4d\">4<\/label>";
    strVar += "        <input id=\"rating3d\" type=\"radio\" name=\"rating5\" value=\"3\">";
    strVar += "        <label for=\"rating3d\">3<\/label>";
    strVar += "        <input id=\"rating2d\" type=\"radio\" name=\"rating5\" value=\"2\">";
    strVar += "        <label for=\"rating2d\">2<\/label>";
    strVar += "        <input id=\"rating1d\" type=\"radio\" name=\"rating5\" value=\"1\">";
    strVar += "        <label for=\"rating1d\">1<\/label>";
    strVar += "        <\/span>";
    strVar += "        <\/p>";
    strVar += "    <\/div>";


    strVar += "    <div class=\"RatingContainer-light\"  style=\"font-size:15px; width:98%; \">";
    strVar += "    <div id=\"one-A\" style=\" float:left; border: 0px solid blue;background-color: #fff;\">" + question6 + "<\/div>";
    strVar += "    <div id=\"one-B\" style=\"width:30%; float:left;min-width:90px; border: 0px solid blue; background-color: #fff; font-size:15px; text-align:left;\">";

    strVar += "            <input type=\"checkbox\" name=\"recommendYes\" id=\"Check0\" value=\"yes\" onclick=\"selectOnlyThis(this.id)\"\/>Yes";
    strVar += "            <input type=\"checkbox\" name=\"recommendNo\" id=\"Check1\" value=\"no\" onclick=\"selectOnlyThis(this.id)\"\/>No";
    strVar += "    <\/div>";
    strVar += "<\/div>";


    strVar += "    <div class=\"RatingContainer-dark\">";
    strVar += "        <textarea name=\"myTextBox1\" rows=\"2\" style=\"width:98%;\" placeholder=\"" + question7 + "\"><\/textarea>";
    strVar += "    <\/div>";
    strVar += "    <div class=\"RatingContainer-light\" style=\"font-size:12px\">" + question8 + "<\/div>";
    strVar += "    <div class=\"RatingContainer\">";
    strVar += "        <input type=\"email\" name=\"myTextBox2\" rows=\"1\" style=\"width:98%;\" placeholder=\"your@email.com\">";
    strVar += "    <\/div>";

    htmlQuestion = strVar;
    launchRating(data.questionnaire.city, data.questionnaire.app, data.questionnaire.IESServerRatingURL);

}

function selectOnlyThis(id) {
    for (var i = 0; i < 2; i++) {
        document.getElementById("Check" + i).checked = false;
    }
    document.getElementById(id).checked = true;
}

/* Uses a file stored on the device in order to count the number of times the app has been launched. */
function launchRating(cName, aName, ServerRatingURL, GooglePlayURL) {
    cityName = cName;
    appName = aName;
    IESServerRatingURL = ServerRatingURL;
    appGooglePlayURL = GooglePlayURL;
    if (typeof (Storage) !== "undefined") {
        if (localStorage.launchCount) {
            localStorage.launchCount = Number(localStorage.launchCount) + 1;
        } else {
            localStorage.launchCount = 1;
        }
        console.log("The app has now been launched " + localStorage.launchCount + " times...");

        //disable for testing
        if ((Number(localStorage.launchCount) == 5) || (Number(localStorage.launchCount) == 20) || (manualTrigger == true)) {

            buildSurvey(htmlQuestion);
        }
    } else {
        console.log("Sorry, your device does not support local storage...");
    }
}

/* Sends the user responses back to the IES platform via the REST API */
function sendRating(theURL) {

    $.ajax({
        async: false, //!!asynchronous ajax call, so that the app is NOT blocked while waiting for the query
        type: "POST",
        data: "",
        url: theURL,
    }).then(function (results) {
        console.log("Successfully saved user feedback with url: " + theURL);
    }, function (jqxhr, textStatus, errorThrown) {
        console.log(jqxhr.status + ", " + textStatus + ", " + errorThrown + ", " + ' Error saving feeback to IES platform');
        console.log("Error url for request was: " + theURL);
    });
}

function sendResponse(appName, questionID, answerID, freetext) {

    // Use the device id from the logging component
    var deviceID = localStorage.deviceID;
    // Form the url for submitting each response to the IES Platform
    url = Restlogging.connection.server + ratingURL + appName + "/" + deviceID + "/" + questionID + "/" + answerID + "/" + freetext;
    sendRating(url);
}

/* Builds the html form(s) that contain the questions (i.e. states) for the user */
function buildSurvey(htmlQuestions) {
    surveyStates = [
        {
            name: "finish",
            title: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + surveyTitle,
            html: htmlQuestion,
            buttons: {
                "Cancel": false,
                "Submit": true
            },
            focus: 1,
            submit: function (e, v, m, f) {
                if (v == false)
                    return true;
                else if (v == true) {
                    surveyComplete = true;
                    return true; // we're done
                } else {
                    return true;
                }
            }
        }
    ];
    startSurvey();
}


/* Fires up the survey (overlay html form over app/website) */
function startSurvey() {

    $.prompt(surveyStates, {
        top: 45,
        close: function (e, v, m, f) { // Handles the closing of the overlay window (i.e. the in-app questionnaire).
            if (v) {
                var questionID = 0;
                var answerID = 0;
                var responses = new Array();
                var cnt = 0;

                //alert(f.myTextBox1+", "+f.myTextBox2+", "+f.onoffswitch+f.rating3);


                var rating1 = -1;
                var rating2 = -1;
                var rating3 = -1;
                var rating4 = -1;
                var rating5 = -1;
                var recommend = "not responded";
                var comments = "no comments";
                var email = "not entered";

                if (f.rating1 != undefined) rating1 = f.rating1;
                if (f.rating2 != undefined) rating2 = f.rating2;
                if (f.rating3 != undefined) rating3 = f.rating3;
                if (f.rating4 != undefined) rating4 = f.rating4;
                if (f.rating5 != undefined) rating5 = f.rating5;
                if ((f.recommendYes != undefined) && (f.recommendYes == "yes")) recommend = "yes";
                if ((f.recommendNo != undefined) && (f.recommendNo == "no")) recommend = "no";
                if ((f.myTextBox1 != undefined) && (f.myTextBox1.length > 0)) comments = f.myTextBox1;
                if ((f.myTextBox2 != undefined) && (f.myTextBox2.length > 0)) email = f.myTextBox2;

                sendResponse(appName, 1, rating1, "Not required");
                sendResponse(appName, 2, rating2, "Not required");
                sendResponse(appName, 3, rating3, "Not required");
                sendResponse(appName, 4, rating4, "Not required");
                sendResponse(appName, 5, rating5, "Not required");
                sendResponse(appName, 6, -1, recommend);
                sendResponse(appName, 7, -1, comments);
                sendResponse(appName, 8, -1, email);

                //alert(" rating1: "+rating1+"\n rating2: "+rating2+"\n rating3: "+rating3+"\n rating4: "+rating4+"\n rating5: "+rating5+
                //      "\n recommend: "+recommend+"\n comments: "+comments+"\n email: "+email);
                //alert(JSON.stringify(f));

                if (surveyComplete) { // Log Questionnaire complete
                    Restlogging.appLog("AppQuestionnaire", "In-app Questionnaire submitted");

                } else {
                    Restlogging.appLog("AppQReject", "In-app Questionnaire rejected");
                    console.log("Survey incomplete");
                }
            } else {
                console.log("Survey closed with X button");
            }
        }
    });
}

function startRatingSurvey(triggerManually) {
    //    if (triggerManually == true) {
    //        $("#map_left_panel").panel("close");
    //    }
    manualTrigger = triggerManually;
    loadJSONfile();
}
