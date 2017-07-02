var api_util = require('../api_util/api_util');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var reviewsApi = {
  reviewsList:function(req, res) {
    if (!req.params || !req.params.locationid) {
      api_util.sendJSONResponse(res, 404, {"message": "No locationid provided."}); return;
    }

    Loc.findById(req.params.locationid).select('reviews').exec(function(err, location){
      if (err) {
        api_util.sendJSONResponse(res, 400, err); return;
      } else if (!location) {
        api_util.sendJSONResponse(res, 404, {"message":"Location not found: "+req.params.locationid}); return;
      }

      api_util.sendJSONResponse(res, 200, location.reviews);

    });
  },
  reviewsCreate:function(req, res) {
    if (!req.params || !req.params.locationid) {
      api_util.sendJSONResponse(res, 404, {"message": "No locationid provided."}); return;
    }

    Loc.findById(req.params.locationid).select('reviews').exec(function(err, location){
      if (err) {
        api_util.sendJSONResponse(res, 400, err); return;
      } else if (!location) {
        api_util.sendJSONResponse(res, 404, {"message":"Location not found: "+req.params.locationid}); return;
      }

      reviewsApi.doAddReview(req, res, location);

    });
  },
  doAddReview:function(req, res, location) {
    var review = {
      name: req.body.name,
      review: req.body.review,
      date: new Date(),
      rating: req.body.rating
    }

    location.reviews.push(review);

    location.save(function(err, location){
      if (err) {
        api_util.sendJSONResponse(res, 400, err);
      } else if (!location) {
        api_util.sendJSONResponse(res, 400, {"message":"Error saving location to DB"});
      } else {
        reviewsApi.updateAverageRating(req.params.locationid);
        api_util.sendJSONResponse(res, 201, location.reviews[location.reviews.length-1]);
      }
    });
  },
  updateAverageRating(locationid) {
    Loc.findById(locationid).select("reviews").exec(function(err, location){
      if (!err && location) {
        location.rating = reviewsApi.getAverageRating(location);
        location.save(function (err, location){
          if (err) {
            console.log(err); 
          } else {
            console.log("Average rating updated: "+location.rating);
          }
        });
      }
    })
  },
  getAverageRating:function(location) {
    var counter = 0;
    var total = 0;
    location.reviews.forEach(function(value, i, arr){
      counter++;
      total += parseFloat(value.rating) || 0;
    });
    return total/counter;
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
    if (!req.params || !req.params.locationid) {
      api_util.sendJSONResponse(res, 404, {"message": "No locationid provided."}); return;
    }
    if (!req.params || !req.params.reviewid) {
      api_util.sendJSONResponse(res, 404, {"message": "No reviewid provided."}); return;
    }

    Loc.findById(req.params.locationid).select('reviews').exec(function(err, location){
      if (err) {
        api_util.sendJSONResponse(res, 400, err); return;
      } else if (!location) {
        api_util.sendJSONResponse(res, 404, {"message":"Location not found: "+req.params.locationid}); return;
      }

      if (location.reviews && location.reviews.length > 0) {
        var review = location.reviews.id(req.params.reviewid);
        if (!review) {
          api_util.sendJSONResponse(res, 404, {"message": "reviewid not found: "+req.params.reviewid}); return;
        }
        review.name = req.body.name || review.name;
        review.date = req.body.date || review.date;
        review.rating = req.body.rating || review.rating;
        review.review = req.body.review || review.review;

        location.save(function(err, location){
          if (err) {
            api_util.sendJSONResponse(res, 400, err); return;
          } else if (!location) {
            api_util.sendJSONResponse(res, 400, {"message":"Error saving location to DB"}); return;
          } 
          reviewsApi.updateAverageRating(req.params.locationid);
          api_util.sendJSONResponse(res, 200, location);
        });
      } else {
        api_util.sendJSONResponse(res, 404, {"message":"No Review to update"});
      }
    });
  },
  reviewsDeleteOne:function(req, res) {
    if (!req.params || !req.params.locationid) {
      api_util.sendJSONResponse(res, 404, {"message": "No locationid provided."}); return;
    }
    if (!req.params || !req.params.reviewid) {
      api_util.sendJSONResponse(res, 404, {"message": "No reviewid provided."}); return;
    }

    Loc.findById(req.params.locationid).select('reviews').exec(function(err, location){
      if (err) {
        api_util.sendJSONResponse(res, 400, err); return;
      } else if (!location) {
        api_util.sendJSONResponse(res, 404, {"message":"Location not found: "+req.params.locationid}); return;
      }

      if (location.reviews && location.reviews.length > 0) {
        var review = location.reviews.id(req.params.reviewid);
        if (!review) {
          api_util.sendJSONResponse(res, 404, {"message": "reviewid not found: "+req.params.reviewid}); return;
        }
        review.remove();
        location.save(function(err){
          if (err) {
            api_util.sendJSONResponse(res, 400, err);
          } else {
            reviewsApi.updateAverageRating(req.params.locationid);
            api_util.sendJSONResponse(res, 204, review);
          }
        });
      } else {
        api_util.sendJSONResponse(res, 404, {"message":"No reviews found for this location"});
      }

    });
  }
}

module.exports = reviewsApi;