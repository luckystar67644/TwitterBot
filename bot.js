// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

//Constant holding the content of the body of the daily message counter
const dailyMessage = "Catch up on today's latest STEM news! The Current Longest Posting Streak is: ";

//counter for how many posts have been made in a row with the bot remaining active, sets to 1 when the bot starts running
var incrementingPostCounter = 1;

// This is the URL of a search for the latest tweets on the '#STEM' hashtag.
var stemSearch = {q: "#STEM", count: 10, result_type: "recent"}; 

// This function keeps track of the total posts the bot has made since it last started running and reports its current streak if it is a record
function retweetLatest() {


  //Find a #STEM tweet
	T.get('search/tweets', stemSearch, function (error, data, response) {
	  // log out any errors and responses
	  console.log(error, data.tweetText);
	  // If our search request to the server had no errors...

	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;    
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, {}, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})

	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});

  //Second search request is called because the console threw errors when a 
  //post was called without a get, don't know why but it works
  T.get('search/tweets', stemSearch, function (error, data, response) {
	  // log out any errors and responses
	  console.log(error, data.tweetText);
	  // If our search request to the server had no errors...
	  if (!error) {
		//Make a post with the daily message const and the incremented streak counter, only runs if no duplicate posts
    //exist allowing it to report the current highest record
		T.post('statuses/update', {status: dailyMessage + incrementingPostCounter}, function (error, data, response) {
      if (response) {
        console.log('Success! Check your bot, it should have retweeted something.')
        //Incements the count for total posts made by the bot since starting
        incrementingPostCounter = incrementingPostCounter + 1;
      }
      // If there was an error with our Twitter call, we print it out here.
      if (error) {
        console.log('There was an error with Twitter:', error);
      }
    })

	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}
// This function is meant to like tweets involving the #STEM hashtag.
T.get('search/tweets', {q: '#STEM', count: 5}
function(err, data, response) {
	var likeId = data.statuses[0].id_str;
	T.post('favorites/create', {id:likeId},
	function(err,data,response) {console.log}("just liked a post")});
	console.log(data);
});
// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 30);


