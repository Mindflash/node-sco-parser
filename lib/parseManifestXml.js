/* eslint-disable no-use-before-define, consistent-return, comma-dangle */
const _ = require('lodash');
const Dom = require('xmldom').DOMParser;
const fs = require('fs');
const xpath = require('xpath');

module.exports = (params, cb) => {
  const p = params || {};
  if (!p.pathOfManifest) return cb('Requires a path to the SCO manifest');

  fs.readFile(p.pathOfManifest, 'ascii', (err, data) => {
    if (err) return cb(err);
    const doc = new Dom().parseFromString(data.substring(2, data.length));

    return cb(null, {
      filePaths: getFilePaths(doc),
      pathOfManifest: p.pathOfManifest,
      quizCount: findQuizCount(doc),
      scoHtmlHref: findIndexFile(doc),
      thumbnailHref: findThumbnail(doc)
    });
  });

  function getFilePaths(doc) {
    const filePaths = [];
    const expr = xpath.parse('(//file[@href])');
    const nodes = expr.select({ node: doc, isHtml: true });
    _.each(nodes, (node) => {
      const attr = node.attributes;
      const href = attr[_.findKey(attr, { name: 'href' })].value;
      if (href) { filePaths.push(href); }
    });
    return filePaths;
  }

  function findIndexFile(doc) {
    const expr = xpath.parse('(//resource[@href])[1]');
    const nodes = expr.select({ node: doc, isHtml: true });
    const attr = nodes[0].attributes;
    const filename = attr[_.findKey(attr, { name: 'href' })].value;
    return filename;
  }

  function findQuizCount(doc) {
    const nodes = xpath.select('//*[name()=\'adlcp:masteryscore\']', doc);
    return nodes.length;
  }

  function findThumbnail(doc) {
    var thumbnailHref = null;

    // For now only looking for a file with the known href for all Storyline thumbnails.
    // Eventually this function may be more interesting if other SCORM creators provide
    // thumbnails in some way.
    const expr = xpath.parse('(//file[@href])');
    const nodes = expr.select({ node: doc, isHtml: true });
    _.each(nodes, (node) => {
      const attr = node.attributes;
      const href = attr[_.findKey(attr, { name: 'href' })].value;
      if (href === 'story_content/thumbnail.jpg') { thumbnailHref = href; }
    });
    return thumbnailHref;
  }
};
