    var algorithmia = require("algorithmia");

    var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
    var input = 'http://prodrumblog.com';

    client.algo("/web/PageRank").pipe(input).then(function(output) {
      if (output.error) {
          console.log(output.error);
      } else {
	      console.log(output);
      }
    });
