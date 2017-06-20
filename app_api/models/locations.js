var mongoose = require('mongoose');

var hoursSchema = new mongoose.Schema({
  days:String, hours:String
})

var ratingSchema = new mongoose.Schema({
  rating:{type:Number, required:true},
  name:{type:String, required:true},
  date:Date,
  review:String
});

var locationSchema = new mongoose.Schema({
  name: {type:String, required:true},
  address: {type:String, required:true},
  gps: {type:[Number], index:'2dsphere', required:true}, //funkyness for GeoJSON
  description: String,
  rating: {type:Number, min:0, max:5},
  hours:[hoursSchema],
  facilities:[String],
  priceTier:Number,
  reviews:[ratingSchema]
});

mongoose.model('Location', locationSchema);