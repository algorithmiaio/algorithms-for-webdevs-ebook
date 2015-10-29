var algorithmia = require("algorithmia");

var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
var input = 'http://prodrumblog.com';

client.algo("/web/PageRank/0.1.0").pipe(input).then(function(output) {
  if (output.error) {
      console.log(output.error);
  } else {
    console.log(output);
  }
});
