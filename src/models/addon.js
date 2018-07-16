'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var AddonSchema = new Schema({
packageName:{ 
 type:String,
 trim:true
},
description:{
    type:String,
    trim:true
},
price:{
type:String,
trim: true
},
totalTradePermitted:{
type:String,
trim:true,
},
totalInventoryAllowed:{
type:String,
trim:true
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

AddonSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }

module.exports = mongoose.model('Addon', AddonSchema);
