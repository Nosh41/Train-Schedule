//Set up Firebase and send data to Firebase
var config = {
    apiKey: "AIzaSyBU4XqE9OhUzkBdQtzqwghU5yph6m8boF0",
    authDomain: "traintracker-8f239.firebaseapp.com",
    databaseURL: "https://traintracker-8f239.firebaseio.com",
    projectId: "traintracker-8f239",
    storageBucket: "",
    messagingSenderId: "47518825994"
};

firebase.initializeApp(config);
var database = firebase.database();

//Create button for adding new trains - then update the html + update the database
$("#add-train-btn").on("click", function(){

    event.preventDefault();

    var trName = $("#train-name-input").val().trim();
    var trDest = $("#destination-input").val().trim();
    var trTime = $("#first-train-input").val().trim();
    var trFreq = $("#frequency-input").val().trim();

    var newTrain = {
        name: trName,
        dest: trDest,
        firstTrain: trTime,
        freq: trFreq
    };

    database.ref().push(newTrain);

    // console.log(newTrain.name);
    // console.log(newTrain.dest);
    // console.log(newTrain.firstTrain);
    // console.log(newTrain.freq);

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");


});

//Grab data from Firebase and put it in browser. Also, calculate next arrival and minutes away
database.ref().on("child_added", function(snapshot, prevChildKey) {

    var trName = snapshot.val().name;
    var trDest = snapshot.val().dest;
    var trTime = snapshot.val().firstTrain;
    var trFreq = snapshot.val().freq;

    // console.log(trName);
    // console.log(trDest);
    // console.log(trTime);
    // console.log(trFreq);

    //Moment JS

    var tempArray = [];
    var trStartTime = moment(trTime,"HH:mm");
    var endOfDay = moment("23:59","HH:mm");
    console.log(endOfDay.format("HH:mm d"));

    while (trStartTime.format("d") === endOfDay.format("d")) {
        //console.log(trStartTime.format("HH:mm d"));
        tempArray.push(trStartTime.format("HH:mm"));
        trStartTime = trStartTime.add(parseInt(trFreq),"m");
    }

    console.log("The Train Schedule",tempArray);
    //var currentTime = moment();

    var trainStartforNxtArrival = moment(trTime,"HH:mm");

    for (var i = 0; i < tempArray.length; i ++){

        console.log("train start", trainStartforNxtArrival.format("HH:mm"));

        if (moment().isBefore(moment(tempArray[i], "HH:mm"))){
            var nextArrival = tempArray[i];
            console.log("if stmt working");
            console.log("This is the next arrival",nextArrival);

            var nextArrivalPretty = moment(nextArrival,"HH:mm").format("hh:mm A");

            break
        }
    }

    //calculate minutes away
    var minutesAway = moment(nextArrival,"HH:mm").diff(moment(), 'minutes');

    console.log("minutes away", minutesAway);

    console.log("Next Arrival",nextArrivalPretty);

    $("#train-table > tbody").append

    // ("<tr><td>" + trName + "</td><td>" + trDest + "</td><td>" + trFreq + "</td><td>" + nextArrivalPretty + "</td><td>"+ minutesAway+"</td></tr>");

        //e6 string literals

(`<tr><td> ${trName} </td><td> ${trDest} </td><td> ${trFreq} </td><td> ${nextArrivalPretty} </td><td> ${minutesAway} </td></tr>`);

});
