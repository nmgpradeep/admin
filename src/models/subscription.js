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
	type:Number,
	trim:true,
},
totalInventoryAllowed:{
	type:Number,
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
   default:1
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
