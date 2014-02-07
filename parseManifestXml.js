"use strict";
var _ = require('lodash');
var async = require('async');

module.exports = function(manifestJSON, cb) {
	async.series({
		scoHtmlHref: getScoHtmlHref
	}, function (err, result) {
		if(err) cb(err);
		cb(null, result);
	});

	function getScoHtmlHref(cb) {
		var scoResource = getScoResource(manifestJSON);
		if(!scoResource) return cb(null);
		var href = scoResource.href;
		if(!href || href == '') return cb(null);
		cb(null, href);
	}

	function getScoResource(json) {
		if(!json) return null;
		var manifest = json.manifest;
		if(!manifest) return null;
		var resources = manifest.resources;

		var scoResource = null;
		_.each(resources, function(resourcesItem) {
			if(!resourcesItem) return;
			_.each(resourcesItem, function (resourceItem) {
				if(!resourceItem) return;
				_.each(resourceItem, function (resourceInfoItem) {
					if(!resourceInfoItem) return;
					var resource = resourceInfoItem.$;
					if(!resource) return;
					var type = resource.type ? resource.type.toLowerCase() : null;
					var scormType = resource['adlcp:scormtype'] ? resource['adlcp:scormtype'].toLowerCase() : null;
					if(type != 'webcontent' || scormType != 'sco') return;
					scoResource = resource;
				});
			});
		});
		return scoResource;
	}
};