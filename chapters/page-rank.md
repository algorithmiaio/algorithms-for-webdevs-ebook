# PageRank
## What is it?
[PageRank](https://algorithmia.com/algorithms/thatguy2048/PageRank) is an algorithm used primarily for rating the popularity of web pages. Although one may initially think 'Page' refers to the web page, it actually refers to the inventor, Larry Page (a founder of Google). This is why you'll find the capital 'P' wherever you find a reference to the algorithm.

The basic assumption is that the more inbound links a web page has across the web, the more valid the content the page contains. It's a crowd-sourcing algorithm of sorts; it relies on everybody online to create a network of links to different web pages, and classifies the  validity of each page based on its overall popularity.

## Applications
The most obvious application of PageRank is the Google search engine. In fact, much of the company's initial success may be attributed to the effectiveness of PageRank in organizing search results on Google.

It is important to note, however, that it is not only web pages which may use PageRank. Any data which can be modeled as a directional graph can be analyzed with PageRank.

## The Math
Consider a directional graph, where web pages are modeled as nodes, and the links are modeled as vertices. Each vertex represents a link from one page to another.

While it may be tempting to simply count the total number of links pointing to each web page to discover which page is the most popular, PageRank is a bit more sophisticated.

We begin by assigning each node a score between zero and one. This score represents a probability distribution. If you are unfamiliar with probability distributions, don't worry. This example will make sense regardless.

The initial score is:

```
PR(N) = 1/n
```

This reads as "The PageRank of each node is one divided by the total number of nodes in the network." Each node starts with the same initial score.

Let's use an example network with five nodes: A, B, C, D, and E. In this case, each node has an initial score of 0.2. Now imagine a link:

```
A -> C
```

This would transfer all of A's scores to C, leaving A with 0 and C with 0.4.

Imagine A with two outbound links:

```
A -> C
A -> D
```

In this case, A would still have 0, but C and D would split the 0.2 from A. This leaves D with 0.3 and C with 0.3.

Be aware that this is an example of a simple Page Rank algorithm. More advanced implementations will use tools such as a [damping factor.](http://www.pagerank.dk/Pagerank-formula/Damping-factor.htm)

## Example 1: Calculating Simple PageRank on an Array of Outbound Links

In this example, we will use Node.js to make our request. Keep in mind you may perform any Algorithmia API request with any tools at your disposal. See [Appendix A](appendix-a.md) to learn how to configure your machine for development with the Algorithmia API in Node.js.

```
var algorithmia = require("algorithmia");
var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = [[1,2,3],[0],[0],[0,4,5,6,7],[],[],[],[]];

client.algo("thatguy2048/PageRank/0.1.0").pipe(input).then(function(output) {
    if (output.error) {
        console.log(output.error);
    } else {
      console.log(output.result);
    }
});
```

The input for the algorithm call is a representation of the outbound links. If we describe them as such:

>page 0 links to pages 1, 2, 3  
>page 1 links to page 0  
>page 2 links to page 0  
>page 3 links to pages 0, 4, 5, 6, 7  
>page 4 has no links  
>page 5 has no links  
>page 6 has no links  
>page 7 has no links  

we can translate the outbound links into the input format. The first object in the array is `[1,2,3]`, representing page 0's outbound links while the last object is `[]`, representing that page 7 has no outbound links. This is how we end up with an input like so:

```
var input = [[1,2,3],[0],[0],[0,4,5,6,7],[],[],[],[]];
```

This particular call will return an array of PageRank scores:
```
[ 0.9142543787391981,
0.4089334112608257,
0.4089334112608257,
0.4089334112608257,
0.21947767079447258,
0.21947767079447258,
0.21947767079447258,
0.21947767079447258 ]
```

As you can see, the first result has the highest score because it had the most inbound links of all the pages.

Note that the API key and input data should be modified to match your needs.

## Example 2: Calculating PageRank for a Real Website Using the URL

Of course, it is not convenient to construct an array of outbound links as shown above if you want to ascertain the PageRank of a real website. The Algorithmia team has conveniently implemented a complete tool to calculate PageRank on all the pages of a website with a single API call.

The [PageRank](https://algorithmia.com/algorithms/web/PageRank) algorithm for the web calculates the PageRank based on the internal links within the input domain. It does not consider links from outside this source. Because this algorithm must complete a traversal of the site, the first run of the algorithm may take a few moments to complete.

```
var algorithmia = require("algorithmia");
var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = 'https://your-domain.com';

client.algo("/web/PageRank/0.1.0").pipe(input).then(function(output) {
    if (output.error) {
      console.log(output.error);
    } else {
      console.log(output.result);
    }
});
```

Try running the script on several different URLs as the input string. The return value `output.result` will be in the form of an array containing values such as:
```
'url' : score
```
The `'url'` will be unique to the page it is ranking, and the score will be represented as a number between 0 and 1. You'll also see that the results are ranked starting with the URL with the highest PageRank, followed by the rest of the URLs in decending order.
