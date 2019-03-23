var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");

// define the schema for our user model
var RestaurantLocationSchema = mongoose.Schema({

    
    "Restaurant ID": String,
    "Country Code":Number,
    "City":String,
    "Address":String,
    "Locality":String,
    "Locality Verbose": [
        {type:String}
    ],
    "Longitude":Number,
    "Latitude" :Number

});

module.exports = mongoose.model('RestaurantLocation', RestaurantLocationSchema);