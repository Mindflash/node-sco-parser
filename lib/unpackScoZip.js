const AdmZip = require('adm-zip');

module.exports = (params, cb) => {
  const p = params || {};
  if (!p.pathToScoZip) return cb('Requires a path to the SCO\'s zip file');
  if (!p.pathToExtractZip) return cb('Requires a path in which to extract the SCO zip file');

  try {
    const zip = new AdmZip(p.pathToScoZip);
    zip.extractAllTo(p.pathToExtractZip, true);
  } catch (err) {
    // console.error('err = ' + err);
    return cb(err);
  }

  return cb();
};
