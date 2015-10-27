var algorithmia = require("algorithmia");
var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = "love";
var no_retweets = [];

console.log("Analyzing tweets with phrase: " + input);
client.algo("/diego/RetrieveTweetsWithKeyword").pipe(input).then(function(output) {
  if (output.error) {
    console.log(output.error);
  } else {
    var tweets = [];
    var tweets = output.result;
    for (var i = 0; i < output.result.length; i++) {
      // Remove retweets. All retweets contain "RT" in the string.
      if (tweets[i].indexOf('RT') == -1) {
        no_retweets.push(tweets[i]);
      }
    }
  }
  analyze_tweets(no_retweets);
});

var analyze_tweets = function(no_retweets) {
  var total_score = 0;
  var score_count = 0;
  var final_score = 0;
  // Execute sentiment analysis on every tweet in the array, then calculate average score.
  for (var j = 0; j < no_retweets.length; j++) {
    client.algo("nlp/SentimentAnalysis").pipe(no_retweets[j]).then(function(output) {
      if(output.error) {
        console.log(output.error);
      } else {
        console.log(output.result);
        score_count = score_count + 1;
        total_score = total_score + output.result;
      }
      // Calculate average score.
      if (score_count == no_retweets.length) {
        final_score = total_score / score_count;
        console.log('final score: ' + final_score);
      }
    })
  }
}
