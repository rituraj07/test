var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");

// define the schema for our user model
var Analytics = mongoose.Schema({

    appearance:Number,
        mid:Number

});

module.exports = mongoose.model('Analytics',Analytics );