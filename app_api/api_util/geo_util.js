var geo_util = (function(){
  var earthRadius = 6371; //km
  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  }
  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  }
  var kmtom = function(km) {
    return parseFloat(km * 1000);
  }
  var mtokm = function(m) {
    return parseFloat(m / 1000);
  }
  return {
    getDistanceFromRads:getDistanceFromRads,
    getRadsFromDistance:getRadsFromDistance,
    kmtom:kmtom,
    mtokm:mtokm
  }
})();

module.exports = geo_util;