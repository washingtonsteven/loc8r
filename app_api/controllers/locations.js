var api_util = require('../api_util/api_util');
var geo_util = require('../api_util/geo_util');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var locationsApi = {
  locationsList:function(req, res) {
    if (req.query.lng !== "undefined" && req.query.lat !== "undefined") {
      locationsApi.locationsListByDistance(req, res);
    } else {
      Loc.find(function(err, locations){
        if (err) {
          api_util.sendJSONResponse(res, 404, err);
        } else {
          api_util.sendJSONResponse(res, 200, locations);
        }
      });
    }
  },
  locationsListByDistance:function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var distance = parseFloat(req.query.dist) || 20;
    var point = {
      type:"Point",
      coordinates: [lng, lat]
    };

    var options = {
      spherical: true, 
      maxDistance: geo_util.kmtom(distance),
      num: 10
    };

    console.log(options.maxDistance);

    Loc.geoNear(point, options, function(err, results, stat){
      if (err)
        api_util.sendJSONResponse(res, 404, err);
      else 
        api_util.sendJSONResponse(res, 200, locationsApi.pruneGeoResults(results));
    });
  },
  locationsCreate:function(req, res) {
    var hoursObj = [];

    for (var i = 0; req.body[`hours[${i}][days]`] && req.body[`hours[${i}][hours]`]; i++) {
      hoursObj.push({
        days:req.body[`hours[${i}][days]`],
        hours:req.body[`hours[${i}][hours]`]
      })
    }

    var locationObj = {
      name:        req.body.name,
      address:     req.body.address,
      gps:         [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      description: req.body.description,
      facilities:  req.body.facilities ? req.body.facilities.split(",") : null,
      hours:       hoursObj,
      priceTier:   req.body.priceTier
    }

    Loc.create(locationObj, function(err, location){
      if (err) {
        api_util.sendJSONResponse(res, 404, err);
      } else {
        api_util.sendJSONResponse(res, 201, location);
      }
    });
  },
  locationsReadOne:function(req, res) {
    if (!req.params || !req.params.locationid) {
      api_util.sendJSONResponse(res, 404, {"message": "No locationid provided."}); return;
    }

    Loc.findById(req.params.locationid).exec(function(err, location){
      if (location && !err) {
        api_util.sendJSONResponse(res, 200, location);
      } else if (!location) {
        api_util.sendJSONResponse(res, 404, {"message": "Location not found: "+req.params.locationid});
      } else if (err) {
        api_util.sendJSONResponse(res, 404, err);
      }
    });
  },
  locationsUpdateOne:function(req, res) {
    api_util.sendJSONResponse(res);
  },
  locationsDeleteOne:function(req, res) {
    api_util.sendJSONResponse(res);
  },
  pruneGeoResults: function(results) {
    var locations = []
    results.forEach(function(doc){
      locations.push({
        distance:geo_util.mtokm(doc.dis),
        name:doc.obj.name,
        address:doc.obj.address,
        rating:doc.obj.rating,
        facilities:doc.obj.facilities,
        _id:doc.obj._id
      });
    });
    return locations;
  }
}

module.exports = locationsApi;