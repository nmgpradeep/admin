'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var AdvertisementSchema = new Schema({
advertisementName:{ 
 type:String,
 trim:true
},
description:{
    type:String,
    trim:true
},
image:{
    type:String,
    trim:true,
    sparse:true   
},
redirectURL:{
type:String,
trim:true
},
status:{
 type:String,
 trim:true,
 sparse:true 
},
},
{
timestamps:true
});

AdvertisementSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
