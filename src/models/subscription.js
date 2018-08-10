'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var SubscriptionSchema = new Schema({
subscriptionName:{ 
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
timePeriod:{
type:String,
trim:true
},
unlimited:{
    type:String,
    trim:true,
    sparse:true    
   },
status:{
 type:String,
 trim:true,
 sparse:true
}
},
{
timestamps:true
});

SubscriptionSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
   }

module.exports = mongoose.model('Subscription', SubscriptionSchema);
