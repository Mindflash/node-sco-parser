'use strict';
var _ = require('lodash');
var dom = require('xmldom').DOMParser;
var fs = require('fs');
var path = require('path');
var xpath = require('xpath');

module.exports = function (params, cb) {
  params = params || {};
  if (!params.pathOfManifest) return cb('Requires a path to the SCO manifest');

  fs.readFile(params.pathOfManifest, 'ascii', function (err, data) {
    if (err) return cb(err);
    var doc = new dom().parseFromString(data.substring(2, data.length));

    return cb(null, {
      filePaths: getFilePaths(doc),
      pathOfManifest: params.pathOfManifest,
      quizCount: findQuizCount(doc),
      scoHtmlHref: findIndexFile(doc),
      thumbnailHref: findThumbnail(doc)
    });
  });

  function getFilePaths(doc) {
    var filePaths = [];
    var nodes = xpath.select('(//file[@href])', doc);
    _.each(nodes, function (node) {
      var attr = node.attributes;
      var href = attr[_.findKey(attr, { 'name': 'href' })].value;
      if (href)
        filePaths.push(href);
    });
    return filePaths;
  }

  function findIndexFile(doc) {
    var nodes = xpath.select('(//resource[@href])[1]', doc);
    var attr = nodes[0].attributes;
    var filename = attr[_.findKey(attr, { 'name': 'href' })].value;
    return filename;
  }

  function findQuizCount(doc) {
    var nodes = xpath.select('//*[name()=\'adlcp:masteryscore\']', doc);
    return nodes.length;
  }

  function findThumbnail(doc) {
    var thumbnailHref = null;

    // For now only looking for a file with the known href for all Storyline thumbnails.
    // Eventually this function may be more interesting if other SCORM creators provide thumbnails in some way.
    var nodes = xpath.select('(//file[@href])', doc);
    _.each(nodes, function (node) {
      var attr = node.attributes;
      var href = attr[_.findKey(attr, { 'name': 'href' })].value;
      if (href == 'story_content/thumbnail.jpg')
        thumbnailHref = href;
    });
    return thumbnailHref;
  }
};
