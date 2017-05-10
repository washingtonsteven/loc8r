var locations = {
  homelist: function(req, res) {
    res.render('homelist', {title: 'Home'});
  },
  locationInfo: function(req, res) {
    res.render('locationDetail', {title: 'Location detail'});
  },
  addReview: function(req, res) {
    res.render('addReview', {title: 'Add a Review'});
  }
}

module.exports = locations;

// module.exports.homeList = locations.homeList;
// module.exports.locationInfo = locations.locationInfo;
// module.exports.addReview = locations.addReview;