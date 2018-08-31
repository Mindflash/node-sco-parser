/* eslint-disable no-shadow, no-use-before-define, prefer-destructuring */
const _ = require('lodash');
const fs = require('fs');
const fstools = require('fs-tools');
const processSco = require('../lib/processSco.js');
const test = require('tap').test;

const pathToCopyFiles = 'tests/fixtures/processScoTests/tmp';

test('Errors when you don\'t pass any parameters', (t) => {
  processSco(null, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path to the SCO manifest');
    t.end();
  });
});

test('Errors when you don\'t pass the path of the manifest', (t) => {
  processSco({}, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path to the SCO manifest');
    t.end();
  });
});

test('Does not error when referencing a SCO that doesn\'t have the Storyline mobile/player_compiled.js', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/nonSpecificOutput'));

  t.test('Does not error when referencing a SCO that doesn\'t have the Storyline mobile/player_compiled.js', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err) => {
      t.notOk(err, 'Should not error');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Successfully modifies a SCO that has the Storyline mobile/player_compiled.js', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/storylineHtml5Output'));

  t.test('Should have code that\'s prior to processing', (t) => {
    const playerCompiledJsString = fs.readFileSync(`${pathToCopyFiles}/mobile/player_compiled.js`, { encoding: 'utf8' });
    t.ok(playerCompiledJsString.indexOf('var k=j-window.innerHeight') >= 0, 'Should still have this code');
    t.ok(playerCompiledJsString.indexOf('if(self!=top)a=a.replace("framewrap","portrait .framewrap").replace("interstitial","portrait .interstitial"),player.rotatePortraitFramedStyleSheet=document.createElement("style"),player.rotatePortraitFramedStyleSheet.innerHTML=a,document.body.appendChild(player.rotatePortraitFramedStyleSheet)') >= 0, 'Should still have this code');
    t.end();
  });

  t.test('Should find modfied text in the Storyline mobile/player_compiled.js', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err) => {
      t.notOk(err, 'Should not error');
      const playerCompiledJsString = fs.readFileSync(`${pathToCopyFiles}/mobile/player_compiled.js`, { encoding: 'utf8' });
      t.ok(playerCompiledJsString.indexOf('var scoParserTop=self;') >= 0, 'Should find JS added at beginning of the file');
      t.ok(playerCompiledJsString.lastIndexOf('scoParserTop.') > 0 && playerCompiledJsString.indexOf('scoParserTop.') !== playerCompiledJsString.lastIndexOf('scoParserTop.'), 'Should find other instances of scoParserTop from the replacement later in the file');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Does not error when referencing a SCO that doesn\'t have the Captivate SCORM_utilities.js', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/nonSpecificOutput'));

  t.test('Does not error when referencing a SCO that doesn\'t have the Captivate SCORM_utilities.js', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err) => {
      t.notOk(err, 'Should not error');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Successfully modifies a SCO that has the Captivate SCORM_utilities.js', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/captivateOutput'));

  t.test('Should find modified text in the Captivate SCORM_utilities.js', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err) => {
      t.notOk(err, 'Should not error');
      const playerCompiledJsString = fs.readFileSync(`${pathToCopyFiles}/SCORM_utilities.js`, { encoding: 'utf8' });
      t.ok(playerCompiledJsString.indexOf('WMODE : "opaque"') >= 0, 'Should find wmode config now set to opaque');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Successfully modifies a SCO that has the Captivate htm/html file that contains the CaptivateContent ID on one of its elements', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/captivateOutput'));

  t.test('Should find modfied text in the Captivate SCORM_utilities.js', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err) => {
      t.notOk(err, 'Should not error');
      const modifiedHtml = fs.readFileSync(`${pathToCopyFiles}/captivate_noquiz_SWFandHTML5output.htm`, { encoding: 'utf8' });
      t.ok(modifiedHtml.match(/<head>\s*<style>\s*html\s*\{\s*height:\s*100%\s*\}\s*body\s*\{\s*height:\s*100%;\s*width:\s*100%;\s*display:\s*table;\s*margin:\s*0\s*\}\s*#CaptivateContent\s*\{\s*display:\s*table-cell\s*;\s*height:\s*100%\s*;\s*vertical-align:\s*middle\s*}\s*<\/style>/), 'Should find CSS added to the head');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Does not error when referencing a SCO that doesn\'t have the Storyline story.html', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/nonSpecificOutput'));

  t.test('Does not error when referencing a SCO that doesn\'t have the Storyline story.html', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err) => {
      t.notOk(err, 'Should not error');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Successfully modifies a SCO that has the Storyline story.html', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/storylineHtml5Output'));

  t.test('Should find modfied text in the Storyline story.html', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err, result) => {
      t.notOk(err, 'Should not error');
      t.equal(result, 'storyline_mobile');
      const playerCompiledJsString = fs.readFileSync(`${pathToCopyFiles}/story.html`, { encoding: 'utf8' });
      t.ok(playerCompiledJsString.indexOf('g_strWMode = "opaque"') >= 0, 'Should find g_strWMode config now set to opaque');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Successfully modifies a SCO that has the Articulate Rise content', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/articulateRiseOutput'));

  t.test('Should find modified text in the Rise scormdriver.js file', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err, result) => {
      t.notOk(err, 'Should not error');
      t.equal(result, 'articulate_rise');
      const playerCompiledJsString = fs.readFileSync(`${pathToCopyFiles}/scormdriver/scormdriver.js`, { encoding: 'utf8' });
      t.ok(playerCompiledJsString.indexOf('scoParserTop.') >= 0, 'Should find sco parser top');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Successfully checks for a camtasia SCO without a quiz', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/camtasiaOutput'));

  t.test('Should return the camtasia type of content', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err, result) => {
      t.notOk(err, 'Should not error');
      t.equal(result, 'camtasia');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

test('Successfully checks for a camtasia SCO with a quiz', (t) => {
  t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('tests/fixtures/processScoTests/camtasiaOutput_withQuiz'));

  t.test('Should return the camtasia type of content', (t) => {
    processSco({ pathOfManifest: `${pathToCopyFiles}/imsmanifest.xml` }, (err, result) => {
      t.notOk(err, 'Should not error');
      t.equal(result, 'camtasia_quiz');
      t.end();
    });
  });

  t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
  t.end();
});

function copyFilesToProcessingLocation(pathOfTestFiles, t) {
  fstools.copy(pathOfTestFiles, pathToCopyFiles, (err) => {
  if (err) t.fail('Failed to copy files to process');
    t.end();
  });
}

function removeTempProcessingLocation(t) {
  fstools.remove(pathToCopyFiles, (err) => {
    if (err) t.fail('Failed to remove copied files for processing');
    t.end();
  });
}
