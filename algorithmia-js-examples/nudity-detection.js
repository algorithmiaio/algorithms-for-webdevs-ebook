    var algorithmia = require("algorithmia");

    var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
    var input = "http://www.lenna.org/full/len_full.jpg";

    client.algo("sfw/NudityDetection").pipe(input).then(function(output) {
      if (output.error) {
          console.log(output.error);
      } else {
	  confidence = parseInt(output.result.match(/[0-9]+/)[0], 10);
	  if (confidence < 85) {
		  console.log("Uncertain");
	  } else if (output.result.indexOf("Not") > -1) {
		  console.log("Not nude");
	  } else {
		  console.log("Nude");
	  }
      }
    });
