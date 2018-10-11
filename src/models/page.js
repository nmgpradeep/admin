'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var PageSchema = new Schema({
pageTitle:{
 type:String,
 trim:true,
 unique: true
},
pageHeading:{
 type:String,
 trim:true
},
description:{
    type:String,
    trim:true
},
bannerImage:{
type:String,
trim: true
},
slug:{
type:String,
trim: true,
lowercase: true
},
status:{
 type:String,
 trim:true,
 sparse:true,
 default:0
}
},
{
timestamps:true
});

PageSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
   }

module.exports = mongoose.model('Page', PageSchema);
