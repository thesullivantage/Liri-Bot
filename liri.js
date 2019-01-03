require("dotenv").config();
var keys = require("./keys.js")
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request')
var fs = require("fs");

var apiType = process.argv[2];
var mediaName = process.argv[3];

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function processCL(command) {
    switch(apiType) {
        case("tweet"):
            Tweet(); break;
        case("song"):
            spot(); break;
        case("movie"):
            omdbCall(); break;
        case("whatsay"):
            whatItSay(); break;
        // default: console.log("Please enter a valid command")
    }     
}

function Tweet() {
    client.get('search/tweets', {q: mediaName}, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.statuses.length; i++) {
                console.log("------------------------------")
                console.log(tweets.statuses[i].created_at)
                console.log(tweets.statuses[i].text)
                console.log("------------------------------")
            };
            console.log(tweets.statuses.length)
        } else {
            console.log(error)
        };
    });
}

function spot () {
    if (mediaName == "") {
        mediaName == "The Sign"
    }
    spotify.search({ type: 'track', query: mediaName }, function(err, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Whole Data: ", response.tracks.items[0] )
        console.log("------------------------------------------------------------")
        console.log("Artists Name: " + response.tracks.items[0].artists[0].name);
        console.log("Song Name: " + response.tracks.items[0].name); 
        console.log("Link: " + response.tracks.items[0].external_urls.spotify);
        console.log("Album Name: " + response.tracks.items[0].album.name);
        console.log("------------------------------------------------------------")
    });
}

function omdbCall () {
    if (mediaName == "") {
        mediaName == "Mr. Nobody"
    }
    request("http://www.omdbapi.com/?t=" + mediaName + "&y=&plot=short&tomatoes=true&apikey=trilogy", function(error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("------------------------------------------------------------------------------------------------------------------------")
            console.log("Title: " + JSON.parse(body).Title)
            console.log("Release Year: " + JSON.parse(body).Year)
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
            console.log("Country of Production: " + JSON.parse(body).Country)
            console.log("Language: " + JSON.parse(body).Language)
            console.log("Plot: " + JSON.parse(body).Plot)
            console.log("Starring Actors: " + JSON.parse(body).Actors)
            console.log("------------------------------------------------------------------------------------------------------------------------")
        }

    });
}

function whatItSay () {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log("ERR", error);
        }

        var dataArr = data.split(",");
        apiType = dataArr[0];
        mediaName = dataArr[1];
        
        processCL();
    });
}

processCL(apiType);

spotify.search({ type: 'track', query: "Let the bodies hit the floor" }, function(err, response) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    console.log("------------------------------------------------------------")
    console.log("Artists Name: " + response.tracks.items[0].artists[0].name);
    console.log("Song Name: " + response.tracks.items[0].name); 
    console.log("Link: " + response.tracks.items[0].external_urls.spotify);
    console.log("Album Name: " + response.tracks.items[0].album.name);
    console.log("------------------------------------------------------------")
})

// Old Testing Function
// function tester() {
//     if (apiType == "my-tweets" ) {
//         Tweet();
//     } 

//     else if (apiType == "spotify-this-song" ) {
//         spot ();
//     }


//     else if (apiType == "movie-this") {
//         omdbCall();
//     }
// }


//utility packages
//dotenv
//request



//content packages
//twitter
//node-spotify-api
//(request from) http://www.omdbapi.com