var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");

// define the schema for our user model
var RestaurantSchema = mongoose.Schema({

    "Restaurant ID": mongoose.Schema.Types.ObjectId,
    "Restaurant Name": String,
    "Cuisines": [
        {type:String}
    ],
    "Average Cost for two": Number,
    "Currency": String,
    "Has Table booking": String,
    "Has Online delivery": String,
    "Aggregate rating": Number,
    "Rating color": String,
    "Rating text":String,
    "Votes":Number
    

});

module.exports = mongoose.model('Restaurant', RestaurantSchema);