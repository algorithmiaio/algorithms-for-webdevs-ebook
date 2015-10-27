    var algorithmia = require("algorithmia");

    var client = algorithmia(process.env.ALGORITHMIA_API_KEY);
    var input = "This is a test sentence for language detection.";

    client.algo("/nlp/LanguageIdentification").pipe(input).then(function(output) {
      if (output.error) {
          console.log(output.error);
      } else {
	      console.log(output.result);
      }
    });
