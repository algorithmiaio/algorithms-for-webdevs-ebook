    var algorithmia = require("algorithmia");

    var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
    var input = [[1,2,3],[0],[0],[0,4,5,6,7],[],[],[],[]];

    client.algo("thatguy2048/PageRank").pipe(input).then(function(output) {
      if (output.error) {
          console.log(output.error);
      } else {
	      console.log(output);
      }
    });
