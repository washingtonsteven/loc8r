var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
}
if (process.env.NODE_ENV === "production") {
  apiOptions.server = "https://immense-ocean-34621.herokuapp.com";
}



var locations = {
  homelist: function(req, res) {
    request({
      url:apiOptions.server+"/api/locations",
      method:"GET",
      json:{},
      qs:{
        lng:-71.040120,
        lat:42.377131
      }
    }, function(err, response, body){
      var locList = [];
      var message = "";

      if (err) {
        console.log(err);
        message = "Error calling for list of locations.";
      } else if (response.statusCode === 200 && body) {
        if (!body.length) {
          message = "No places found nearby.";
        } else {
          locList = body
          for (var i = 0; i < locList.length; i++) {
            locList[i].distance = formatDistance(locList[i].distance);
          }
        }   
      } else {
        console.log(response.statusCode);
        message = "API Error (GET /locations): "+response.statusCode;
      }

      res.render('homelist', {title: 'Home', body_id:"homelist", locations:locList, facilityIcons:facilityIcons, message:message});
    });
  },
  locationInfo: function(req, res) {
    request({
      url:apiOptions.server+"/api/locations/"+req.params.locationid,
      method:"GET",
      json:{},
      qs:{}
    }, function(err, response, body){
      var loc = null;
      var message = "";

      if (err) {
        console.log(err);
        message = "Error calling for list of locations.";
      } else if (response.statusCode === 200) {
        var loc = body;
        loc.distance = formatDistance(loc.distance);
      } else {
        console.log(response.statusCode);
        message = "API Error (GET location/"+req.params.locationid+"): "+response.statusCode;
      }

      console.log(loc);
      
      res.render('locationDetail', {title: 'Location detail', body_id:"locationDetail", location:loc, facilityIcons:facilityIcons, gmaps_api_key:process.env.GMAPS_API_KEY});
    });
  },
  addReview: function(req, res) {
    request({
      url:apiOptions.server+"/api/locations/"+req.params.locationid,
      method:"GET",
      json:{},
      qs:{}
    }, function(err, response, body){
      var loc = null;
      var message = "";

      if (err) {
        console.log(err);
        message = "Error calling for list of locations.";
      } else if (response.statusCode === 200) {
        var loc = body;
        loc.distance = formatDistance(loc.distance);
      } else {
        console.log(response.statusCode);
        message = "API Error (GET location/"+req.params.locationid+"): "+response.statusCode;
      }

      res.render('addReview', {title: 'Add a Review', body_id:"addReview", location:loc});
    });
  }
}

module.exports = locations;

var facilityIcons = {
  'wifi':'fa-wifi',
  'wifi-locked':'fa-lock',
  'wifi-purchase':'fa-money',
  'drinks-hot':'fa-coffee',
  'alcohol':'fa-glass',
  'food':'fa-cutlery',
}

function formatDistance(dist) {
  if (dist > 1) {
    return parseFloat(dist).toFixed(1) + "km";
  } else {
    return parseInt(dist * 1000, 10).toFixed(0) + "m";
  }
}

// var locationList = [
//   {
//     'id':1,
//     'name':'South End Buttery',
//     'address': '314 Shawmut Ave, Boston, MA 02118',
//     'gps':{
//       'lat':42.342088,
//       'lng':-71.070352
//     },
//     'description':'A local cafe featuring a robust carry-out market.',
//     'rating':3.5,
//     'hours':[
//       {'days': 'M-F', 'hours':'6am - 10pm'},
//       {'days': 'Sat', 'hours':'8am - 6pm'},
//       {'days': 'Sun', 'hours':'closed'},
//     ],
//     'facilities':['wifi', 'wifi-locked', 'wifi-purchase', 'drinks-hot', 'food'],
//     'priceTier':3,
//     'reviews':[
//       {
//         'rating':3.5,
//         'name':'Bob McClursky, Jr.',
//         'date':'2017-05-27 14:34:17 EST',
//         'review':'This place is okay. The coffee is expensive and it takes a while to get food, but it\'s a good place to sit and chill from the busy city for a bit.'
//       }
//     ]
//   },
//   {
//     'id':2,
//     'name':'The Wholy Grain',
//     'address': '275 Shawmut Ave, Boston, MA 02118',
//     'gps':{
//       'lat':42.343037,
//       'lng':-71.069415
//     },
//     'description':'A small cafe know for it\'s filling \'Wholy Bowl\'',
//     'rating':4.5,
//     'hours':[
//       {'days': 'M-F', 'hours':'7am - 6pm'},
//       {'days': 'Sat', 'hours':'8am - 6pm'},
//       {'days': 'Sun', 'hours':'10am - 4pm'},
//     ],
//     'facilities':['wifi', 'drinks-hot', 'food'],
//     'priceTier':2,
//     'reviews':[
//       {
//         'rating':4.5,
//         'name':'Mark Joyson',
//         'date':'2017-04-16 09:56:01 EST',
//         'review':'Good food, cookies are great! Tables are small though.'
//       }
//     ]
//   }
// ]

