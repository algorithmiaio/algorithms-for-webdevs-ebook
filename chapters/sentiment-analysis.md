# Sentiment Analysis
## What is it?
People who speak a language can easily read through a paragraph and quickly identify whether the writer had an overall positive or negative impression of the topic at hand. However, for a computer, which has no concept of natural spoken language, this problem must be reduced to mathematics. Without any context of what words actually mean, it cannot simply deduce whether a piece of text conveys joy, anger, frustration, or otherwise. Sentiment analysis seeks to solve this problem by using natural language processing to recognize keywords within a document and thus classify the emotional status of the piece.

## Applications
Businesses today often seek feedback on their products and services. Before online content and social media data became abundant, companies would ask for direct feedback from their customers in a variety of ways. They may have used hand written forms submitted on-location or via mail. Or, they may have hired a telephone survey company to call customers and ask questions directly. Today companies can mine online data to gain insight on customer sentiment of their products and services.  Use of sentiment analysis algorithms across product reviews lets online retailers know what consumers think of their products and respond accordingly.

Sociologists and other researchers can also use this kind of data to learn more about public opinion. A great example is [MemeTracker](http://www.memetracker.org/index.html), an analysis of online media about current events. Political organizations often want to understand people's overall opinion of a particular politician or political conundrum in order to develop a strategy during election season. Comment sections on news websites are frequent targets for said groups, as people who take time to respond are prone to be more politically engaged than other citizens. This in turn serves as a form of low-cost, soft polling.

## The Math
Basic sentiment analysis algorithms use natural language processing (NLP) to classify documents as positive, neutral, or negative. Programmers and data scientists write software which feeds documents into the algorithm and stores the results in a way which is useful for clients to use and understand.

Keyword spotting is the simplest technique leveraged by sentiment analysis algorithms. Input data is scanned for obviously positive and negative words like 'happy', 'sad', 'terrible', and 'great'. Algorithms vary in the way they score the documents to decide whether they indicate overall positive or negative sentiment. Different algorithms have different libraries of words and phrases which they score as positive, negative, and neutral. When exploring these algorithms, you might run into the nickname for these libraries of words: "bag of words".

This technique has a few shortcomings. Consider the text, "The service was terrible, but the food was great!" This sentiment is more complex than the algorithm can really take into account, because it contains both positive and negative words. More advanced algorithms will split sentences when words like 'but' appear. Such a case is called 'constrastive conjunction'.  Such a result then becomes, "The service was terrible" AND "But the food was great!"  The sentence thus generates two or more scores, which then must be consolidated. This is called [binary sentiment analysis.](http://nlp.stanford.edu/~socherr/EMNLP2013_RNTN.pdf)

Keep in mind that due to the complexity of organic language, most sentiment analysis algorithms are about 80% accurate, at best.

## Example: Sentiment Analysis of Twitter Data
Let's build a sentiment analysis of Twitter data to show how you might integrate an algorithm like this into your applications. We'll first start by choosing a topic, then we will gather tweets with that keyword and perform sentiment analyis on those tweets. We'll end up with an overall impression of whether people view the topic positively or not.

### Step 1: Gather Tweets
First, choose a topic you wish to analyze. Inside `sentiment-analysis.js`, you can define `input` to be whatever phrase you like. In this example, we'll use a word we expect to return positive results.

```
var algorithmia = require("algorithmia");
var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = "happy";
var no_retweets = [];

console.log("Analyzing tweets with phrase: " + input);
client.algo("/diego/RetrieveTweetsWithKeyword/0.1.2").pipe(input).then(function(output) {
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

// We will cover this function in the next step.
analyze_tweets(no_retweets);
});
```

As you can see, first we use the Algorithmia API to pass our topic to the algorithm [RetrieveTweetsWithKeyword](https://algorithmia.com/algorithms/diego/RetrieveTweetsWithKeyword) as our input. This will grab tweets containing our phrase. Second, we clear out the retweets so that we don't have duplicate data throwing off our scores. Twitter conveniently includes "RT" at the beginning of each tweet, so we find tweets with that string and remove them from our data set. This leaves us with a convenient set of tweets in the array `no_retweets`.

### Step 2: Perform Sentiment Analysis on Tweets
After gathering and cleaning our data set, we are ready to execute the sentiment analysis algorithm on each tweet. Then, we will calculate an average score for all the tweets combined.

```
var analyze_tweets = function(no_retweets) {
    var total_score = 0;
    var score_count = 0;
    var final_score = 0;

    // Execute sentiment analysis on every tweet in the array, then calculate average score.
    for (var j = 0; j < no_retweets.length; j++) {
        client.algo("nlp/SentimentAnalysis/0.1.1").pipe(no_retweets[j]).then(function(output) {
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
```

In the above code, we iterated through each tweet in `no_retweets` to send that as input to the [Sentiment Analysis](https://algorithmia.com/algorithms/nlp/SentimentAnalysis) algorithm. Then with the results from that API call, we added the output result to a `total_score` variable. We keep track of how many tweets we've gone through with the variable `score_count`, so that when it reaches the same number as the number of tweets we wanted to analyze we then calculate the final score by averaging the `total_score`. This final result returns a number in the range [0-4] representing, in order, very negative, negative, neutral, positive, and very positive sentiment.
