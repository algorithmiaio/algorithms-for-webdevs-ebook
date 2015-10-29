# TF-IDF: Term Frequency-Inverse Document Frequency
## What is it?
TF-IDF (Term Frequency-Inverse Document Frequency) is a text mining technique used to categorize documents. Have you ever looked at blog posts on a web site, and wondered if it is possible to generate the tags automatically? Well, that's exactly the kind of problem TF-IDF is suited for.

It is worth noting the differences between TF-IDF and sentiment analysis. Although both could be considered classification techniques for text, their goals are distinct. On the one hand, sentiment analysis aims to classify documents into opinions such as 'positive' and 'negative'. On the other hand, TF-IDF classifies documents into categories inside the documents themselves. This would give insight about what the reviews are about, rather than if the author was happy or unhappy. If we analyzed product review data from an e-commerce site selling computer parts, we would end up with groups of documents about 'laptop', 'mouse', 'keyboard', etc. We would gain a large amount of data about the types of reviews that had been written, but would not learn anything about what the users thought of those products. Although the algorithms are similar in that they classify text, the results of each give us unique insights.

## Applications
This algorithm is useful when you have a document set, particularlly a large one, which needs to be categorized. It is especially nifty because you don't need to train a model ahead of time and it will automatically account for differences in lengths of documents.

Imagine a large corporate website with tens of thousands of user contributed blog posts. Depending on the tags attached to each blog post, the item will appear on listing pages on various parts of the site. Although the authors were able to tag things manually when they wrote the content, in many cases they chose not to, and therefore many blog posts are not categorized. Empirics show that only a small fraction of users will take the time to manually add tags and assist with categorization of posts and reviews, making voluntary organization unsustainable. Such a document set is an excellent use-case for TF-IDF, because it can generate tags for the blog posts and help us display them in the right areas of our site. Best of all, no intern would have to suffer through manually tagging them on their own! A quick run of the algorithm would go through the document set and sort through all the entries, eliminating a great deal of hassle.

## The Math
TF-IDF computes a weight which represents the importance of a term inside a document. It does this by comparing the frequency of usage inside an individual document as opposed to the entire data set (a collection of documents).

The importance increases proportionally to the number of times a word appears in the individual document itself--this is called Term Frequency. However, if multiple documents contain the same word many times then you run into a problem. That's why TF-IDF also offsets this value by the frequency of the term in the entire document set, a value called Inverse Document Frequency.

```
TF(t) = (Number of times term t appears in a document) / (Total number of terms in the document)
IDF(t) = log_e(Total number of documents / Number of documents with term t in it).
Value = TF * IDF
```

TF-IDF is computed for each term in each document. Typically, you will be interested either in one term in particular (like a search engine), or you would be interested in the terms with the highest TF-IDF in a specific document (such as generating tags for blog posts).

## Example: Tagging Blog Posts
### Step 1: Generate Scores for Each Document

Let's say you have a 100 word blog post with the word "JavaScript" in it 5 times. The calculation for the Term Frequency would be:
```
     TF = 5/100 = 0.05
```

Next, assume your entire collection of blog posts has 10,000 documents and the word "JavaScript" appears at least once in 100 of these. The Inverse Document Frequency calculation would look like this:

```
     IDF = log(10,000/100) = 2
```

To calculate the TF-IDF, we multiply the previous two values. This gives us the final score:

```
     TF-IDF = 0.05 * 2 = 0.1
```

### Step 2: Decide a Threshold to Tag
After running this algorithm against all 100 of the blog posts with the word "JavaScript", you end up with a score for each.

This is where you will have a chance to exercise the creative aspect of being a data scientist. Let's assume that you have a wide range of scores, ranging from 0.05 to 0.5.

Continuing a simple example from this collection, 0.05 would be a 100 word document with 1 instance of "JavaScript" and 0.5 would be a 100 word document with "JavaScript" appearing 25 times. To determine if the document will be tagged with "JavaScript", you need to decide on a threshold score.

The score you choose will vary depending on your data set. A document with only one instance of "JavaScript" (score 0.05) is unlikely to be focused on JavaScript, but obvioulsy the high score of 0.5 is probably on topic.

## TF-IDF Code Example Using Node.js
See [Appendix A](appendix-a.md) to learn how to configure your machine for development with the Algorithmia API in Node.js.

[The Keywords For Document Set](https://algorithmia.com/algorithms/nlp/KeywordsForDocumentSet) algorithm implements TF-IDF for a function to retrieve keywords in a document set. This function expects a set of documents, each as a separate string, and an integer to define how many keywords to return. 

The following example passes three documents and returns the top two keywords from each document, including the TF-IDF score:

```
var algorithmia = require("algorithmia");
var client = algorithmia(process.env.ALGORITHMIA_API_KEY);

var input = [["badger badger buffalo mushroom mushroom mushroom mushroom mushroom mushroom mushroom","antelope buffalo mushroom","bannana"],2];

client.algo("nlp/KeywordsForDocumentSet/0.1.7").pipe(input).then(function(output) {
  if (output.error) {
      console.log(output.error);
  } else {
      console.log(output.result);
  }
});
```

This returns:
```
[ { mushroom: 0.5187490272120597, badger: 0.8078365072138199 },
{ antelope: 0.47712125471966244, buffalo: 0.17609125905568124 },
{ bannana: 0.47712125471966244 } ]
```

As you can see, the algorithm calculated the frequency of each word. If you do the math, you'll find that these TF-IDF scores are not just a simple average, but are weighted as explained in this chapter. Note that because the last document only contained one value, the return value for the final document only contains one value.
