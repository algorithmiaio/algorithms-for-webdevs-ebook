# Language Detection
## What is it?
A language detection algorithm is pretty self-explanatory: we'll take text as input and decide which human language the text is written in. We'll be using Algorithmia's [Language Identification algorithm](https://algorithmia.com/algorithms/nlp/LanguageIdentification) to give it a try.

## Applications
In Natural Language Processing (NLP), one may need to work with data sets which contain documents in various languages. Many NLP algorithms only work with certain languages, usually because the training data they rely upon is in a single language. It can be a valuable time saver to determine which language your data set is in before you run more algorithms on it.

A second example application of the Language Detection algorithm lies in the web search arena. A web crawler will hit pages which are potentially written in one of many different languages. If this data is to be used by a search engine, the results are going to be most helpful to the end user if the language used in the search is the same as the results. You can easily see how a web developer who must work with content in multiple languages would want to implement language detection as part of a search functionality.

Spam filtering services which support multiple languages must be able to identify the language that emails, online comments, and other input is written in before the true spam filtering algorithms can be applied.  Without such detection, content originating from specific countries, regions, or areas suspected of generating spam cannot be properly eliminated from online platforms.

## The Math
Language classifications rely upon using an primer of specialized text called a 'corpus'. There is one corpus for each language the algorithm can identify. Speaking in summary, input text is compared to each corpus and pattern matching is used to identify the strongest correlation to a corpus.

Because there are so many potential words to profile in every language, computer scientists use algorithms called 'profiling algorithms' to create a subset of words for each language, to be used for the corpus. The most common strategy is to choose very common words. In English, we might choose words like "the", "and", "of" and "or".

This approach works well when the input data is relatively lengthy. The shorter the phrase in the input text, the less likely these common words are to appear, and the less likely the algorithm will classify correctly. In fact, some languages don't have spaces between written words, making such isolation impossible.

Facing this problem, researchers tried to use character sets in a general manner, rather than relying on them being split into words. Even if the words have spaces between them, relying on the natural words alone often causes problems when analyzing short phrases.

One is then left to experiment with how many letters to analyze. The N-gram algorithm [implemented by Apache Tika](https://tika.apache.org/1.5/api/org/apache/tika/language/LanguageIdentifier.html) uses 3 letters, and is therefore called a 3-gram. This algorithm is available conveniently through the Algorithmia API with a single HTTP request.

## Example: Identifying Language of a Single String

### Making an Algorithmia API Request Using Node.js
In this example, we will use Node.js to make our request. Keep in mind you may perform any Algorithmia API request with any tools at your disposal. See [Appendix A](appendix-a.md) to learn how to configure your machine for development with the Algorithmia API in Node.js.

```
var algorithmia = require("algorithmia");
var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = "This is a demo sentence for language detection.";

client.algo("/nlp/LanguageIdentification/0.1.0").pipe(input).then(function(output) {
    if (output.error) {
        console.log(output.error);
    } else {
        console.log(output.result);
    }
});
```    
Note that the API key should be modified to match your configuration.

This will return the string `en` to indicate English. You may read more about the implementation and find a list of supported languages on the [algorithm's page.](https://algorithmia.com/algorithms/nlp/LanguageIdentification)
