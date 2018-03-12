# sco-parser

A simple validator and parser for SCO zip files written in [node](http://nodejs.org/)

## Usage

	var params = {
		pathToScoZip: 'testFiles/unpackScoZipTests/articulate_sco_with_quiz.zip',
		pathToExtractZip: 'testFiles/unpackScoZipTests/extractFolder'
	}

	// initialize the parser
	var scoParser = require('sco-parser')(params);

	scoParser.validate(function(err, result)) {
		scoParser.parse(function(err, scoInfo)) {

			console.log(scoInfo.scoHtmlHref);	// entry point to the sco
			console.log(scoInfo.quizCount);		// value is 1 if a quiz exists in the sco

			scoParser.destroy(function(err) {});
		});
	});

## Params

Initialize the parser.

`pathToScoZip` - location to find the scorm package (zip file)

`pathToExtractZip` - location to unpack the scorm package to

## Methods

`validate` - validates that a scorm package (.zip) contains an imsmanifest.xml

`parse` - returns basic information about the scorm package

	scoHtmlHref		// filename which is the entry point to the sco
	quizCount			// number of quizzes found in the sco

`destroy` - cleans up temp files

## License

MIT
