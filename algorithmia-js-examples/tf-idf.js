var algorithmia = require("algorithmia");
 
var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = [["badger badger buffalo mushroom mushroom mushroom mushroom mushroom mushroom mushroom","antelope buffalo mushroom","bannana"],2];
 
client.algo("nlp/KeywordsForDocumentSet").pipe(input).then(function(output) {
    if (output.error) {
        console.log(output.error);
    } else {
        console.log(output.result);
    }
});
