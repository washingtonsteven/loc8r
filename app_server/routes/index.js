var express = require('express');
var router = express.Router();
// var mainController = require('../controllers/main');
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');



/* Locations */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocations.addReview);

/* Others */
router.get('/about', ctrlOthers.about);

module.exports = router;
