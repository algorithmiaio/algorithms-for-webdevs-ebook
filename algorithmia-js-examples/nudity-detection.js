    var algorithmia = require("algorithmia");

    var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
    var input = "http://www.lenna.org/full/len_full.jpg";

    client.algo("sfw/NudityDetection/1.0.x").pipe(input).then(function(output) {
      if (output.error) {
          console.log(output.error);
      } else {
	  var result = JSON.parse(output.result);
	  confidence = result.confidence;
	  if (confidence < 85) {
		  console.log("Uncertain");
	  } else if (result.nude) {
		  console.log("Nude");
	  } else {
		  console.log("Not nude");
	  }
      }
    });
