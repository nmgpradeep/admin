/*  *Country Model
    *Author: Saurabh Agarwal
    *Date  : July 16, 2018
*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var CountrySchema = new Schema({
    countryName: {
        type: String,
        trim: true
    },
    countryCode: {
        type: String,
        trim: true
    },
    status:{
        type:String,
        trim:true,
        sparse:true 
       },
    countryId: []
    
},
{
    timestamps:true
});
CountrySchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}
module.exports = mongoose.model('Country', CountrySchema);
