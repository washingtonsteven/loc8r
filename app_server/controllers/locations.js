var locations = {
  homelist: function(req, res) {
    res.render('homelist', {title: 'Home', body_id:"homelist"});
  },
  locationInfo: function(req, res) {
    res.render('locationDetail', {title: 'Location detail', body_id:"locationDetail"});
  },
  addReview: function(req, res) {
    res.render('addReview', {title: 'Add a Review', body_id:"addReview"});
  }
}

module.exports = locations;

// module.exports.homeList = locations.homeList;
// module.exports.locationInfo = locations.locationInfo;
// module.exports.addReview = locations.addReview;