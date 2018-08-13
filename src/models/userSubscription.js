'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var UserSubscriptionSchema = new Schema({

userId:{
    type:String,
    trim:true
},
subscriptionId:{
type:String,
trim: true
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

UserSubscriptionSchema.methods.toJSON = function() {
    var obj = this.toObject();   
    return obj;
}

module.exports = mongoose.model('UserSubscription', UserSubscriptionSchema);
