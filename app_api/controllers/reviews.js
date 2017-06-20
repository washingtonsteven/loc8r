var api_util = require('../api_util/api_util');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var reviewsApi = {
  reviewsCreate:function(req, res) {
    api_util.sendJSONResponse(res);
  },
  reviewsReadOne:function(req, res) {
    if (!req.params || !req.params.locationid) {
      api_util.sendJSONResponse(res, 404, {"message": "No locationid provided."}); return;
    }
    if (!req.params || !req.params.reviewid) {
      api_util.sendJSONResponse(res, 404, {"message": "No reviewid provided."}); return;
    }

    Loc.findById(req.params.locationid).select('name reviews').exec(function(err, location){
      if (!location) {
        api_util.sendJSONResponse(res, 404, {"message": "Location not found: "+req.params.locationid}); return;
      } else if (!location.reviews || location.reviews.length <= 0) {
        api_util.sendJSONResponse(res, 404, {"message": "Location has no reviews: "+req.params.locationid}); return;
      } else if (err) {
        api_util.sendJSONResponse(res, 404, err); return;
      }

      var review;
      review = location.reviews.id(req.params.reviewid);
      if (review) {
        api_util.sendJSONResponse(res, 200, review);
      } else {
        api_util.sendJSONResponse(res, 404, {"message": "Review not found: "+req.params.reviewid});
      } 
    });
  },
  reviewsUpdateOne:function(req, res) {
    api_util.sendJSONResponse(res);
  },
  reviewsDeleteOne:function(req, res) {
    api_util.sendJSONResponse(res);
  }
}

module.exports = reviewsApi;