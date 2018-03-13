/* eslint-disable no-use-before-define, consistent-return, comma-dangle */
const async = require('async');
const fs = require('fs');
const fstools = require('fs-tools');
const path = require('path');

module.exports = (params, mainCb) => {
  const p = params || {};
  if (!p.pathOfManifest) return mainCb('Requires a path to the SCO manifest');

  async.parallel([
    fixStorylineMobileJs,
    fixStorylineWindowMode,
    fixCaptivateFlashPlayerScaling,
    fixCaptivateWindowMode,
    fixArticulateRiseJs
  ], mainCb);

  function fixStorylineMobileJs(cb) {
    const playerCompiledJsPath = path.join(path.dirname(p.pathOfManifest), 'mobile', 'player_compiled.js');
    if (!fs.existsSync(playerCompiledJsPath)) return cb();

    try {
      var playerCompiledJsString = fs.readFileSync(playerCompiledJsPath, { encoding: 'utf8' });

      // Storyline is referencing parent frame which causes cross-frame issues on iOS.
      // Hacking the mobile player JS to have it reference itself instead and thus fix it.
      playerCompiledJsString = `var scoParserTop=self;${playerCompiledJsString}`;
      playerCompiledJsString = playerCompiledJsString.replace(/top\./g, 'scoParserTop.');

      // This fixes landscape mode on iPad in Storyline.
      playerCompiledJsString = `window.scoParserOrientation=90;${playerCompiledJsString}`;
      playerCompiledJsString = playerCompiledJsString.replace(/window\.orientation/g, 'window.scoParserOrientation');

      fs.writeFileSync(playerCompiledJsPath, playerCompiledJsString, { encoding: 'utf8' });
      cb();
    } catch (err) {
      return cb(err);
    }
  }

  // Storyline sets SWFs' wmode to 'window'.
  // Fix this to be 'opaque' so it works well within a webapp.
  function fixStorylineWindowMode(cb) {
    const storyHtmlPath = path.join(path.dirname(p.pathOfManifest), 'story.html');
    if (!fs.existsSync(storyHtmlPath)) return cb();

    try {
      var storyHtmlString = fs.readFileSync(storyHtmlPath, { encoding: 'utf8' });
      storyHtmlString = storyHtmlString.replace(/g_strWMode\s*=\s*"window"/g, 'g_strWMode = "opaque"');
      fs.writeFileSync(storyHtmlPath, storyHtmlString, { encoding: 'utf8' });
      cb();
    } catch (err) {
      return cb(err);
    }
  }

  // Help captivate scale better when playing SWF.
  function fixCaptivateFlashPlayerScaling(cb) {
    try {
      fstools.walkSync(path.dirname(p.pathOfManifest), '.html|.htm$', (_path) => {
        var fileHtmlString = fs.readFileSync(_path, { encoding: 'utf8' });

        // If we see an element with an ID of CaptivateContent then add our CSS hack.
        if (fileHtmlString.match(/id\s*=\s*"CaptivateContent"/)) {
          const headTag = '<head>';
          const afterOpenHeadTagIndex = fileHtmlString.indexOf(headTag) + headTag.length;
          fileHtmlString = `${fileHtmlString.substr(0, afterOpenHeadTagIndex)
          }<style>
              html {height:100%}
              body {height:100%; width:100%; display:table; margin:0}
                 #CaptivateContent {display:table-cell; height:100%; vertical-align:middle}
            </style>${fileHtmlString.substr(afterOpenHeadTagIndex)}`;
          fs.writeFileSync(_path, fileHtmlString, { encoding: 'utf8' });
        }
      });
      cb();
    } catch (err) {
      return cb(err);
    }
  }

  // Captivate sets SWFs' wmode to 'window'.
  // Fix this to be 'opaque' so it works well within a webapp.
  function fixCaptivateWindowMode(cb) {
    const scormUtilitiesJsPath = path.join(path.dirname(p.pathOfManifest), 'SCORM_utilities.js');
    if (!fs.existsSync(scormUtilitiesJsPath)) return cb();

    try {
      var scormUtilitiesJsString = fs.readFileSync(scormUtilitiesJsPath, { encoding: 'utf8' });
      scormUtilitiesJsString = scormUtilitiesJsString.replace(/WMODE\s*:\s*"window"/g, 'WMODE : "opaque"');
      fs.writeFileSync(scormUtilitiesJsPath, scormUtilitiesJsString, { encoding: 'utf8' });
      cb();
    } catch (err) {
      return cb(err);
    }
  }

  function fixArticulateRiseJs(cb) {
    const playerCompiledJsPath = path.join(path.dirname(p.pathOfManifest), 'scormdriver', 'scormdriver.js');
    if (!fs.existsSync(playerCompiledJsPath)) return cb();

    try {
      var playerCompiledJsString = fs.readFileSync(playerCompiledJsPath, { encoding: 'utf8' });

      // Articulate Rise is referencing parent frame which causes cross-frame issues
      // Hacking the mobile player JS to have it reference itself instead and thus fix it.
      playerCompiledJsString = `var scoParserTop=self;${playerCompiledJsString}`;
      playerCompiledJsString = playerCompiledJsString.replace(/top\./g, 'scoParserTop.');

      fs.writeFileSync(playerCompiledJsPath, playerCompiledJsString, { encoding: 'utf8' });
      cb();
    } catch (err) {
      return cb(err);
    }
  }
};
